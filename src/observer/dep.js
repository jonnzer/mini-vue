let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    depend() {
        this.subs.push(Dep.target)
        console.log(this.subs);
    }
    notify() {
        this.subs.forEach((watcher) => {
            watcher.update()
        })
    }
}

let stack = []

// 保留和移除watcher

export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(Dep.target)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep