import historyBase from "./base";

const ensureSlash = () => { // 确保当前是哈希模式，url有哈希值
    let { location } = window
    if (location.hash) {
        return
    }
    location.hash = '/'
}

/**
 * hash 模式， 实现功能：
 * (1) 获取当前路由 getCurrentRoute
 * (2) 监听路由改变 setupListener
 */
export default class HashHistory extends historyBase {
    constructor(routerInstance) {
        super(routerInstance) // super 传值给父类
        this.routerInstance = routerInstance
        ensureSlash()

        this.actionHandler = this.actionHandler.bind(this)
    }
    getCurrentRoute () {
        return window.location.hash.slice(1)
    }

    actionHandler () {
        this.transitionTo(this.getCurrentRoute()) // 路由改变后，手动跳转
    }

    setupListener () {
        window.addEventListener('hashchange', this.actionHandler)
        // window.addEventListener('load', this.actionHandler)
    }
    push (location) {
        this.transitionTo(location)
        window.location.hash = location
    }
}