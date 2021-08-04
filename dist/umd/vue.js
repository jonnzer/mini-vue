(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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
  function proxy(vm, source, key) {
    // 数据访问代理
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }
  var LIFECYCLE_HOOKS = [// 生命周期名字
  'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeHook(oldVal, newVal) {
    if (newVal) {
      if (oldVal) {
        return oldVal.concat(newVal);
      } else {
        return [newVal];
      }
    }
  } // 默认的合并规则 特殊属性有其他合并方式


  function mergeOptions(oldOpt, newOpt) {
    var options = {};

    for (var key in oldOpt) {
      mergeField(key);
    }

    for (var _key in newOpt) {
      if (!oldOpt.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](oldOpt[key], newOpt[key]); // ?
      }

      if (_typeof(oldOpt[key]) === 'object' && _typeof(newOpt[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, oldOpt[key]), newOpt[key]);
      } else if (newOpt[key] === null || newOpt[key] === undefined) {
        options[key] = oldOpt[key];
      } else {
        options[key] = newOpt[key];
      }
    }

    return options;
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
      configurable: true,
      enumerable: true,
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
    // vm.data.*** => vm.*** 取数据方便

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  // 模板字符串：
  // <div id="app">
  //  <p>{{name}}</p>
  // </div>
  // 此文件的作用是将template的html字符串转成AST结构
  // 需要的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aa:bb>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 <sss 捕获的内容是标签名

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>   

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性 id="idName"

  var root = null; // ast语法树的树根

  var currentParent; // 标识当前父亲

  var stack = []; // 标签字符串数组

  var ELEMENT_TYPE = 1; // 

  var TEXT_TYPE = 3; // 

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    // 记录开始标签 ，并生成AST树
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element; // 当前元素标记成父AST树

    stack.push(element);
  }

  function chars(text) {
    // 文本是 text
    text = text.replace(/\s/g, ''); // 替换所有的空格为空

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    // 标签闭合 tagName
    //console.log(
    var element = stack.pop(); // 拿到栈中的最后一个元素

    currentParent = stack[stack.length - 1]; // 取栈中的最后一个元素 的父级元素

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  } //advance(***[0].length) 是regExp.match匹配返回第一个参数 


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

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 如果剩下的匹配不到结束标签，则视为有属性，处理属性值的返回
          advance(attr[0].length); // 将开始标签的属性从模板字符串中删除

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length); // 删除开始标签的>

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
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 开始标签匹配完毕后  继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch.tagName);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        // 包含空白节点的情况
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ddd}} 

  function generate(el) {
    // el 是AST语法树
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",\n        ").concat(el.attrs.length ? genProps(el.attrs) : undefined // 设置标签属性时 有属性取属性否则取undefined
    , "\n        ").concat(children ? ",".concat(children) : '', ")\n    ");
    return code;
  }

  function genChildren(el) {
    // 生成孩子 el.chilren 是可以使用的
    var children = el.children;

    if (children && children.length) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    // node type 1 3 区别是元素节点还是文本节点 递归思想
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text; // 到这一步仍需处理text 可能存在{{}}语法
      // a {{name}} b {{age}} c 
      // 转化成
      // _v("a" + _S(name) + "b" + _s(age) + "c")
      // 正则存在lastIndex的问题，需重置为0 ？？？
      // 正则 exec 0: "{{name}}" 1: "name" index匹配文本的第一个字符的位置

      var tokens = []; // 待拼接的字符串数组

      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genProps(attrs) {
    // 生成属性  attrs:[{name: id, value: '**'}] => 多个{id: **}
    var str = '';
    attrs.forEach(function (item) {
      if (item.name === 'style') {
        var obj = {};
        item.value.split(';').forEach(function (styleItem) {
          if (styleItem) {
            var splitItem = styleItem.split(':');
            obj[splitItem[0]] = splitItem[1];
          }
        });
        str += "style: ".concat(JSON.stringify(obj), ",");
      } else {
        str += "".concat(item.name, ":").concat(JSON.stringify(item.value), ",");
      }
    }); //return `{${str.substring(0, str.length - 1)}}`

    return "{".concat(str.slice(0, -1), "}");
  }

  // AST 虚拟dom
  function compileToFunction(template) {
    // (1) 解析html字符串 => AST语法树
    var root = parserHTML(template); // AST语法树 => render函数
    // 原理：模版引擎？？？
    // html字符串： <div id="app"><p>hello {{name}}</p> test</div>
    // render函数： _c("div", {id: app}, _c("p", undefined, _v('hello' + _s(name))), _v('hello'))

    var code = generate(root); // 所有的模板引擎的实现 底层原理  new Function () {}  with

    var renderFn = new Function("with(this){ return ".concat(code, "}")); // renderFn返回的是虚拟dom

    return renderFn;
  }

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      // 所有属性都放在实例上
      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn;
      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        this.getter(); // 执行 exprOrFn
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // 第一次oldVnode 是标签
    console.log(oldVnode, vnode); // 1 判断是更新还是渲染

    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode; // 获取父级节点是为了提前存好插入的位置

      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    }
  }

  function createElm(vnode) {
    //return document.createElement('div')
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text; // 是标签或创建标签
    // 标签

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        // 递归创建儿子节点
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 文本    
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    // 更新属性
    var newProps = vnode.data || {};
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  // 生命周期

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      console.log(vnode);
      vm.$el = patch(vm.$el, vnode); // 虚拟vnode创建真实dom 替换已有的$el
    };
  }
  function mountComponent(vm, el) {
    vm.$options;
    vm.$el = el; // $el用来存放真实dom

    callHook(vm, 'beforeMount'); // 渲染页面 渲染或更新都会调用

    var updateComponent = function updateComponent() {
      // Watcher就是用来渲染的 ??? 还有绑定监听
      // vm._render 通过解析的render方法，渲染出虚拟dom _c _v _s
      // vm._update 通过虚拟dom 创建真实的dom
      // 渲染页面
      vm._update(vm._render()); // 执行顺序是先里后外

    }; // 渲染watcher 每个组件都有一个watcher vm.$watch(() => {} )   空函数是watch后的回调处理


    new Watcher(vm, updateComponent, function () {}, true);
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    // vue 原型添加一个init方法
    Vue.prototype._init = function (options) {
      // 数据劫持
      var vm = this; // 子类 继承 用户传递和全局进行合并

      vm.$options = mergeOptions(vm.constructor.options, options); // vue中的this.$options等于 用户传入的属性

      callHook(vm, 'beforeCreate');
      initState(vm); // 初始化状态

      callHook(vm, 'created'); // 如果有el的参数，就渲染到节点上 template render

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
      } // 拿到render函数后 可以渲染当前组件


      mountComponent(vm, el);
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // ...children是函数的rest参数写法，es6. 用于获取函数的多余参数
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    //console.log(text);
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 虚拟节点 就是_c _v 实现用对象来描述dom的操作

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } // vnode 通用结构  需转换成真实的html
  //const vnode = {
  //    tag: 'div',
  //    key: undefined,
  //    data: {},
  //    children: [],
  //    text: undefined
  //}

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); // tag, data, children
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      // render函数调用，返回的是vnode
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm); // 绑定this 配合with的this参数
    };
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };

    Vue.mixin({
      a: 1,
      b: 2,
      beforeCreate: function beforeCreate() {
        console.log('fn1');
      }
    });
    Vue.mixin({
      b: 3,
      c: 4,
      beforeCreate: function beforeCreate() {
        console.log('fn2');
      }
    });
    console.log(Vue.options);
  }

  function Vue(options) {
    // vue的初始化操作
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
