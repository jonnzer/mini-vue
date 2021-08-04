import { initState } from "./state"
import { compileToFunction } from './compiler/index'
import { mountComponent, callHook } from "./lifecycle"
import { mergeOptions } from "./util/index"

export function initMixin(Vue) {
    // vue 原型添加一个init方法
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this

        // 子类 继承 用户传递和全局进行合并
        vm.$options = mergeOptions(vm.constructor.options, options) // vue中的this.$options等于 用户传入的属性

        callHook(vm, 'beforeCreate')

        initState(vm)         // 初始化状态

        callHook(vm, 'created')

        // 如果有el的参数，就渲染到节点上 template render
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }


    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // render > template > el 渲染优先级
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML
            }

            // template => render函数
            const render = compileToFunction(template)
            options.render = render
        }

        // 拿到render函数后 可以渲染当前组件
        mountComponent(vm, el)

    }
}
