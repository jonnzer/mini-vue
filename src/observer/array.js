// 重新数组的常用API
// push shfit unshift pop reverse sort splice 会导致数组本身产生变化的API都要处理

const oldArrayPrototye = Array.prototype

export const arrayMethods = Object.create(oldArrayPrototye) // 自定义的数组方法 继承 数组API

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice',
]

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayPrototye[method].apply(this, args) // this指向value？？？
    const ob = this.__ob__
    // 不管删除类的API，只看添加或者修改数组的API
    let inserted // 用户插入的元素
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice': // 删除 修改 新增 arr.splice(0,1, {name: 1}) // 获取 {name: 1}
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) ob.observerArray(inserted) // 观察新插入的对象
    ob.dep.notify() // 数组dep更新
    return result
  }
})
