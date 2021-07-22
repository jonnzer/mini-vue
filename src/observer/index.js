import { isObject, def } from "../util/index.js"
import { arrayMethods } from './array.js'

// 要承载比较多的方法
// 当值是数组的时候，索引也会作为key去监听 get 0() get 1()这样是无意义的操作，也会拖慢性能
class Observer {
    constructor(value) {
        // 把new Observer(data)存放在每一个被监控的对象里 方便复写的数组API能调用观察者的方法
        // value.__ob__ = this 这是错误的写法，因为定义的__ob__也是一个对象，会造成无限生成__ob__,并无限观察它。解决方法是
        // Object.defineProperty 不可枚举 不可复写 已封装到def里
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            // 直接操作数组API的方式，大多数都不是通过操作索引
            // vm._data.testArr.push({ c: 1 }) 这种操作在没处理的结果是，新增的对象没添加观察，所以要改写数组的常用API，比如push、unshift、shift
            // 如果数组里面有对象，才会对数组观察，否则是不必要浪费性能的
            Object.setPrototypeOf(value, arrayMethods)
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }
    //为什么不在class里继续定义defineReactive 而是新开了一个functio  @question
    //defineReactive(data) {}
    walk(data) { // 递归 Object.defineProperty 添加get set
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    observerArray(value) { // 观察数组
        value.forEach(item => {
            observe(item)
        })
    }


}

function defineReactive(data, key, value) {
    observe(value)
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newVal) {
            if (newVal === value) { return }
            // 如果用户手动设置更新了data的对象，那么也要给新对象上的数据进行数据劫持
            observe(newVal)
            value = newVal
        }
    })
}

export function observe(data) {
    // 如果不是对象的话，就可以直接退出了
    if (!isObject(data)) {
        return
    }
    return new Observer(data)
}



