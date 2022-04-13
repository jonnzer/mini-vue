import historyBase from "./base";
/**
 * 浏览器 history模式， 实现功能：
 * (1) 获取当前路由 getCurrentRoute
 * (2) 监听路由改变 setupListener
 */
export default class BrowserHistory extends historyBase {
    constructor(routerInstance) {
        super(routerInstance)
        this.routerInstance = routerInstance

    }

    getCurrentRoute () {

    }

    setupListener () {

    }
}