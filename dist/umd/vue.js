(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 判断传参是否为对象
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  } // Object.defineProperty的特定简写 不可枚举

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 重新数组的常用API
  // push shfit unshift pop reverse sort splice 会导致数组本身产生变化的API都要处理
  var oldArrayPrototye = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototye);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayPrototye[method].apply(this, args); // this指向value？？？

      var ob = this.__ob__; // 不管删除类的API，只看添加或者修改数组的API

      var inserted; // 用户插入的元素

      switch (method) {
        case 'push':
        case 'splice':
          inserted = args;
          break;

        case 'splice':
          // 删除 修改 新增 arr.splice(0,1, {name: 1})
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observerArray(inserted); // 观察新插入的对象

      return result;
    };
  });

  // 当值是数组的时候，索引也会作为key去监听 get 0() get 1()这样是无意义的操作，也会拖慢性能

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 把new Observer(data)存放在每一个被监控的对象里 方便复写的数组API能调用观察者的方法
      // value.__ob__ = this 这是错误的写法，因为定义的__ob__也是一个对象，会造成无限生成__ob__,并无限观察它。解决方法是
      // Object.defineProperty 不可枚举 不可复写 已封装到def里
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 直接操作数组API的方式，大多数都不是通过操作索引
        // vm._data.testArr.push({ c: 1 }) 这种操作在没处理的结果是，新增的对象没添加观察，所以要改写数组的常用API，比如push、unshift、shift
        // 如果数组里面有对象，才会对数组观察，否则是不必要浪费性能的
        Object.setPrototypeOf(value, arrayMethods);
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    } //为什么不在class里继续定义defineReactive 而是新开了一个functio  @question
    //defineReactive(data) {}


    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 递归 Object.defineProperty 添加get set
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        // 观察数组
        value.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) {
          return;
        } // 如果用户手动设置更新了data的对象，那么也要给新对象上的数据进行数据劫持


        observe(newVal);
        value = newVal;
      }
    });
  }

  function observe(data) {
    // 如果不是对象的话，就可以直接退出了
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // vue文件的 script层 编写顺序 prop data computed watch 生命周期 method 针对传入实例的对应属性做不同的处理

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化工作
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // MVVM 数据劫持 数据驱动视图更新 vue2.0是Object.defineProperty getter setter vue3 proxy

    observe(data);
  }

  // AST 虚拟dom
  // 需要的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aa:bb>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 <sss 捕获的内容是标签名

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>   

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性 id="idName"
  // 模板字符串：
  // <div id="app">
  //  <p>{{name}}</p>
  // </div>
  //advance(***[0].length) 是regExp.match匹配返回第一个参数 

  function parserHTML(html) {
    // 解析HTMLDOM文本 => DOM树（包含属性、子节点、父节点）
    function parsestartTag() {
      // 解析开始标签
      var start = html.match(startTagOpen); // 匹配开始标签头

      if (start) {
        advance(start[0].length); // start[0]: <div  将标签从模板字符串中删除

        var match = {
          tagName: start[1],
          // 'div'
          attrs: []
        };
        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 如果剩下的匹配不到结束标签，则视为有属性，处理属性值的返回
          advance(attr[0].length); // 将开始标签的属性从模板字符串中删除

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (end) {
          advance(end[0].length); // 删除开始标签的>

          return match; // 这才是真正return到外面的结果
        }
      }
    }

    function advance(n) {
      // 前进n位 处理html解析的不断更新字符串
      html = html.substring(n);
    }

    while (html) {
      // while 只要循环条件为真，一直执行的特点
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 是标签的左边 包含开始标签 和结束标签
        var startTagMatch = parsestartTag(); // startTagMatch 包含tagName attrs

        if (startTagMatch) {
          console.log(startTagMatch);
          continue; // 开始标签匹配完毕后  继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        // 包含空白节点的情况
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
      }
    }
  }

  function compileToFunction(template) {
    parserHTML(template);
    return function render() {};
  }

  function initMixin(Vue) {
    // vue 原型添加一个init方法
    Vue.prototype._init = function (options) {
      // 数据劫持
      var vm = this;
      vm.$options = options; // vue中的this.$options等于 用户传入的属性

      initState(vm); // 初始化状态
      // 如果有el的参数，就渲染到节点上 template render

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // render > template > el 渲染优先级

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // template => render函数


        var render = compileToFunction(template);
        options.render = render;
      }
    };
  }

  function Vue(options) {
    // vue的初始化操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map