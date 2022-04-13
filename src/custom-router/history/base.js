/**
 * base.js
 * @feature: 存放两种路由模式，公用的一些逻辑
 * (1) 路由跳转 
 * (2) 路由匹配
 */

/**
 * 循环运行迭代器 (相当于中间件)
 * 递归执行内置next函数
 */ 
function runQueue(queueList, iterator, cb) {
    function next (index) {
        if (index >= queueList.length) {
            return cb()
        }
        iterator(queueList[index], () => next(index + 1))
    }
    next(0)
}

export default class historyBase {
    constructor (routerInstance) {
        this.routerInstance = routerInstance
        this.updateCurrent = null // 更新current匹配值的回调函数
        // 定义初始匹配值 {path: '', matched: []}
        this.current = createRoute(null, {
            path: '/'
        })
    }

    /**
     * @feature 匹配路由的视图，监听路由变化
     * @param {*} location 当前路由 
     * @param {*} callback 回调函数：一般是监听路由函数
     */
    transitionTo (location, callback) { // 路由跳转
        let newCurrent = this.routerInstance.match(location)

        // 处理重复跳转路由(路径和匹配个数一样则视为重复)
        let { path: currentPath, matched }  = this.current
        if (currentPath === location && matched.length === newCurrent.matched.length) {
            // console.log('这次和上次跳转路由一样')
            return
        }

        // beforeEach 钩子执行
        let hooksQueue = this.routerInstance.beforeHooks
        
        // 钩子执行函数
        // 这里用箭头函数，方便取 this.current
        const iterator = (hook, nextFn) => {
            hook(newCurrent, this.current, nextFn)
        }

        runQueue(hooksQueue, iterator, () => {
            // 路由已更新
            this.current = newCurrent
            this.updateCurrent && this.updateCurrent(this.current)
            // 渲染对应路由

            callback && callback()
        })
    }

    // 收集最新的this.current
    listen (cb) {
        this.updateCurrent = cb
    }
}

/**
 * @feature  返回匹配记录，包括关联的子组件或父组件
 * @param {*} record 组件
 * @param {*} location 
 */
export const createRoute = (record, location) => {
    let matched = []
    if (record) {
        while (record) { // 递归添加父组件到匹配数组里
            matched.unshift(record)
            record = record.parent
        }
    }
    return {
        ...location,
        matched
    }
}