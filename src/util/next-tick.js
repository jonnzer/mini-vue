const callbackArr = []
// nextTick原理 把用户的操作放到异步进程的最后执行，就可保证一定是最新的数据
// [flushSchedularQueue, userNextTick]

let waiting = false // 多次调用nextTick，没有刷新队列的时候，先放到数组中，加入等待状态 刷新后再盖比那等待状态

function flushCallBack() {
  callbackArr.forEach((cb) => cb())
  waiting = false
}

// eslint-disable-next-line no-undef
export function nextTick(cb) {
  callbackArr.push(cb)
  if (waiting === false) {
    setTimeout(flushCallBack, 0)
    waiting = true
  }
}
