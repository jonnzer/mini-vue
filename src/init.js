import { initState } from "./state"
import { compileToFunction } from './compiler/index'
import { mountComponent } from "./lifecycle"

export function initMixin(Vue) {
    // vue 原型添加一个init方法
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this
        vm.$options = options // vue中的this.$options等于 用户传入的属性
        initState(vm)         // 初始化状态

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
