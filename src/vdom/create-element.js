export function createElement(tag, data = {}, ...children) { // ...children是函数的rest参数写法，es6. 用于获取函数的多余参数
    let key = data.key
    if (key) { delete data.key }
    return vnode(tag, data, key, children, undefined)
}

export function createTextNode(text) {
    //console.log(text);
    return vnode(undefined, undefined, undefined, undefined, text)
}

// 虚拟节点 就是_c _v 实现用对象来描述dom的操作
function vnode(tag, data, key, children, text) {

    return {
        tag,
        data,
        key,
        children,
        text
    }
}

// vnode 通用结构  需转换成真实的html
//const vnode = {
//    tag: 'div',
//    key: undefined,
//    data: {},
//    children: [],
//    text: undefined
//}