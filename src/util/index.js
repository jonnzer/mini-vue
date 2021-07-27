// 判断传参是否为对象
export function isObject(data) {
    return typeof data === 'object' && data !== null
}

// Object.defineProperty的特定简写 不可枚举
export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
    })
}

export function proxy(vm, source, key) { // 数据访问代理
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}