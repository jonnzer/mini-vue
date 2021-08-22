import { nextTick } from '../util/next-tick'

let queue = []
let has = {}
/*
    解决场景：
    vm.testArr.push(1)
    vm.testArr.push(2)
    vm.testArr.push(3)
    vm.testArr.push(4)
    update四次，其实应该是同一个watcher，只update一次就够了
*/

function flushSchedularQueue() {
  queue.forEach((watcher) => watcher.run())
  queue = []
  has = {}
}

export function queueWatcher(watcher) { // 队列更新
  const { id } = watcher
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    // Vue.nextTick
    // promise / mutationObserver / setImmediate / setTimeout
    nextTick(flushSchedularQueue)
  }
}
