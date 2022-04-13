import install from './install'
import createMatcher from './create-matcher'
import BrowserHistory from './history/browserHistory'
import HashHistory from './history/hashHistory'

class customRouter {
    /**
     * 
     * @param {*} options 用户传入 router配置：new VueRouter的参数
     */
    constructor(options) {
        this.$options = options
        this.mode = options.mode || 'hash'
        let routes = options.routes || []
        this.history = null  // 存储实例化 HashRouter 或 HistoryRouter
        this.beforeHooks = [] // 存放钩子

        // 创建router匹配结构
        // (1) url => component render
        // (2) 增加 url 或者删除 url ：addRoutes 权限
        this.$matcher = createMatcher(routes)
        
        switch (this.mode) {
            case 'hash':
                this.history = new HashHistory(this)
                break;
            case 'history':
                this.history = new BrowserHistory(this)
                break
            default:
                break;
        }
    }

    /**
     * @feature 方便调用 createMatcher 方法返回的match方法
     * @param {*} location 路由字符串
     */
    match (location) {
        return this.$matcher.match(location)
    }

    init (app) { // 根据路由mode做匹配监听
        // console.log('init app ', app) // app 为注册了router的vue根实例
        const history = this.history
        const setupListener = () => { // 用函数包裹是为了待会调用方便
            history.setupListener()
        }
        history.transitionTo(history.getCurrentRoute(), setupListener)

        // 回调: listen内的都是回调函数，每次有新的路由匹配值，都会执行该回调函数，更新了vue根实例上的_route属性
        history.listen((route) => {
            app._route = route
        })
    }
    /**
     * 跳转API
     * @param {*} location router-link to属性值 字符串
     */
    push(location) {
       this.history.push(location)
    }

    // 钩子
    /**
     * 
     * @param {*} fn 
     */
    beforeEach(fn) {
        this.beforeHooks.push(fn)
    }

}

customRouter.install = install

export default customRouter