import Dep, { pushTarget, popTarget } from './dep'
import { queueWatcher } from './schedular'

let id = 0
class Watcher {
  constructor(vm, exprOrFn, callback, options) { // 所有属性都放在实例上
    this.vm = vm
    this.callback = callback
    this.options = options
    // eslint-disable-next-line no-plusplus
    this.id = id++ // 保持watcher的唯一性
    this.getter = exprOrFn
    this.depsId = new Set()
    this.deps = [] // 存放唯一的dep
    this.get()
  }

  get() {
    // 不直接调用 exprOrFn 的原因是，调用的基础上，还有额外的操作 存储和移除watcher
    pushTarget(this) // water存起来， Dep.target
    this.getter() // 执行 exprOrFn
    popTarget() // 移除全局watcher Dep.target
  }

  update() { // watcher的update方法，在dep的观察者更新时候会调用
    // 考虑一种情况：操作的都是同一个属性，建立的watcher是同一个watcher，watcher 的id是一样的，然后update好几次。
    // 需要弄一个队列更新
    // console.log(this.id);
    queueWatcher(this)
    // this.get()
  }

  run() {
    this.get()
  }

  addDep(dep) { // watcher关联dep dep里不能放重复的watcher watcher里不能发重复的dep
    const { id } = dep // set结构存储它 set结构可以去重
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this) // dep 关联 watcher
    }
  }
}

export default Watcher
