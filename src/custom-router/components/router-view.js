export default {
    name: 'router-view',
    functional: true, // 函数式组件 没有this 没有data 没有生命周期，减少性能消耗
    render(h, context) { // context 是执行上下文 可以获取数据
        let { parent, data } = context // data可以用来打标识
        let route = parent.$route
        data.routerView = true // 遍历到的层级 设置属性
        let depth = 0 // matched索引
        while (parent) { // $vnode 和 _vnode的区别
           if (parent.$vnode && parent.$vnode.data.routerView) {
               depth++
           }
           parent = parent.$parent
        }
        
        let record = route.matched[depth]
        if (!record) {
            return h() // 渲染空
        }
        return h(record.component, data) // 渲染组件
    }
}