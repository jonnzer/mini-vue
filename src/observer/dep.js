let id = 0
class Dep { // depend和notify方法用到了观察者模式
  constructor() {
    this.id = id++
    this.subs = []
  }

  depend() {
    // 添加Dep.target和dep的互相记忆关系
    console.log('depend触发', this)
    Dep.target.addDep(this)
  }

  notify() {
    this.subs.forEach((watcher) => {
      watcher.update()
    })
  }

  addSub(watcher) { //  dep 关联 watcher
    this.subs.push(watcher)
  }
}

const stack = [] // 是用来存放dep.target 保留和移除watcher

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(Dep.target)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1] // Dep.target的值会变成undefined
}

export default Dep
