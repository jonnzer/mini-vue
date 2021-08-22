import { createElement, createTextNode } from './vdom/create-element'

export function renderMixin(Vue) {
  // _c 创建元素的虚拟节点
  // _v 创建文本的虚拟节点
  // _s JSON.stringify

  Vue.prototype._c = function () {
    return createElement(...arguments) // tag, data, children
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }

  Vue.prototype._s = function (val) {
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }

  Vue.prototype._render = function () { // render函数调用，返回的是vnode
    const vm = this
    const { render } = vm.$options
    return render.call(vm) // 绑定this 配合with的this参数
  }
}
