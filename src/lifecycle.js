// 生命周期
// render函数生成的dom替换el


import Watcher from "./observer/watcher";
import { patch } from './vdom/patch'


// 定义vm._update
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode) // 虚拟vnode创建真实dom 替换已有的$el
    }
}

export function mountComponent(vm, el) {
    const options = vm.$options
    vm.$el = el // $el用来存放真实dom

    callHook(vm, 'beforeMount')

    // 渲染页面 渲染或更新都会调用
    let updateComponent = () => {
        // Watcher就是用来渲染的 ??? 还有绑定监听
        // vm._render 通过解析的render方法，渲染出虚拟dom _c _v _s
        // vm._update 通过虚拟dom 创建真实的dom

        // 渲染页面
        console.log('update');
        vm._update(vm._render()) // 执行顺序是先里后外

    }
    // 渲染watcher 每个组件都有一个watcher vm.$watch(() => {} )   空函数是watch后的回调处理
    new Watcher(vm, updateComponent, () => { }, true)
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}