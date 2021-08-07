import { pushTarget, popTarget } from './dep'

let id = 0
class Watcher {
    constructor(vm, exprOrFn, callback, options) { // 所有属性都放在实例上
        this.vm = vm
        this.callback = callback
        this.options = options
        this.id = id++
        this.getter = exprOrFn
        this.get()
    }
    get() {
        // 不直接调用 exprOrFn 的原因是，调用的基础上，还有额外的操作 存储和移除watcher
        pushTarget(this) // water存起来， Dep.target
        this.getter() // 执行 exprOrFn
        popTarget() // 移除全局watcher Dep.target
    }
    update() {
        this.get()
    }
}

export default Watcher