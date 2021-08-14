export function patch(oldVnode, vnode) {
    // 第一次oldVnode 是标签
    // 1 判断是更新还是渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldElm = oldVnode
        const parentElm = oldElm.parentNode // 获取父级节点是为了提前存好插入的位置
        let el = createElm(vnode)
        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)
        return el
    }
}

function createElm(vnode) {
    //return document.createElement('div')
    let {
        tag,
        children,
        key,
        data,
        text
    } = vnode // 是标签或创建标签

    // 标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => { // 递归创建儿子节点
            return vnode.el.appendChild(createElm(child))
        });
    } else { // 文本    
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode) { // 更新属性
    let newProps = vnode.data || {}
    let el = vnode.el
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}