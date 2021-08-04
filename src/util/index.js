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

const LIFECYCLE_HOOKS = [ // 生命周期名字
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

let strats = {}

LIFECYCLE_HOOKS.forEach((hook) => {
    strats[hook] = mergeHook
})

function mergeHook(oldVal, newVal) {
    if (newVal) {
        if (oldVal) {
            return oldVal.concat(newVal)
        } else {
            return [newVal]
        }
    }
}



// 默认的合并规则 特殊属性有其他合并方式
export function mergeOptions(oldOpt, newOpt) {
    const options = {}
    for (let key in oldOpt) {
        mergeField(key)
    }
    for (let key in newOpt) {
        if (!oldOpt.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        if (strats[key]) {
            return options[key] = strats[key](oldOpt[key], newOpt[key]) // ?
        }
        if (typeof oldOpt[key] === 'object' && typeof newOpt[key] === 'object') {
            options[key] = {
                ...oldOpt[key],
                ...newOpt[key]
            }
        } else if (newOpt[key] === null || newOpt[key] === undefined) {
            options[key] = oldOpt[key]
        } else {
            options[key] = newOpt[key]
        }
    }
    return options
}