import { observe } from './observer/index.js'
import { proxy } from './util/index.js'
export function initState(vm) {
    const opts = vm.$options

    // vue文件的 script层 编写顺序 prop data computed watch 生命周期 method 针对传入实例的对应属性做不同的处理
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethod(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initProps() { }
function initMethod() { }


function initData(vm) {
    // 数据初始化工作
    let data = vm.$options.data
    data = vm._data = typeof (data) === 'function' ? data.call(vm) : data

    // MVVM 数据劫持 数据驱动视图更新 vue2.0是Object.defineProperty getter setter vue3 proxy
    // vm.data.*** => vm.*** 取数据方便

    for (let key in data) {
        proxy(vm, '_data', key)
    }

    observe(data)

}
function initComputed() { }
function initWatch() { }