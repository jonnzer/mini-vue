// 生命周期
// render函数生成的dom替换el
console.log('lifecycleMixin.js');


import Watcher from "./observer/watcher";



// 定义vm._update
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        console.log('vm._update');
    }
}

export function mountComponent(vm, el) {
    const options = vm.$options
    vm.$el = el // $el用来存放真实dom

    // 渲染页面 渲染或更新都会调用
    let updateComponent = () => {
        // Watcher就是用来渲染的 ??? 还有绑定监听
        // vm._render 通过解析的render方法，渲染出虚拟dom _c _v _s
        // vm._update 通过虚拟dom 创建真实的dom

        // 渲染页面
        vm._update(vm._render()) // 执行顺序是先里后外
    }
    // 渲染watcher 每个组件都有一个watcher vm.$watch(() => {} )   空函数是watch后的回调处理
    new Watcher(vm, updateComponent, () => { }, true)

}