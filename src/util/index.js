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