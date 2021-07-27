class Watcher {
    constructor(vm, exprOrFn, callback, options) { // 所有属性都放在实例上
        this.vm = vm
        this.callback = callback
        this.options = options

        this.getter = exprOrFn
        this.get()
    }
    get() {
        this.getter() // 执行 exprOrFn
    }

}

export default Watcher