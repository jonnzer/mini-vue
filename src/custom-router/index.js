 /* eslint-disable */
let vue
class customRouter {
    constructor(options) {
        this.$options = options
        this.$routeMap = {} // 从vue options拿到routes数组，绑定在实例上
        // this.currentRoute = '/'
        vue.util.defineReactive(this, 'currentRoute', '/') // vue的工具，用来设置响应式，是因为组件调用时，会触发响应式，重新渲染组件
        window.addEventListener('hashchange', this.getCurrentRoute.bind(this))
        window.addEventListener('load', this.getCurrentRoute.bind(this))
        this.$options.routes.forEach(item => { // 这里的options仅仅是路由配置表
            this.$routeMap[item.path] = item.component
        })
    }
    getCurrentRoute() {
        this.currentRoute = location.hash.slice(1)
    }

}


customRouter.install = function (_vue) {
    vue = _vue
    vue.mixin({
        beforeCreate() {
            if (this.$options?.router) { // 已经把custom-router类 挂载到vue实例了
                vue.prototype.$router = this.$options.router // 这一步作用是将当前custom-router的挂在到vue原型上
            }
        }
    })
    vue.component('router-link', {
        props: ['to'],
        render(h) {
            // 参数1 标签
            // 参数2 属性
            // 参数3 子级
            return h('a', { attrs: { href: '#' + this.to }, class: 'router-link' }, this.$slots.default)
        }
    })
    // console.log('component: ', component)
    vue.component('router-view', {
        render(h) {
            console.log('vue $router: ', this)
            let { $routeMap, currentRoute } = this.$router // 已经可以用vue原型上来操作了
            let component = $routeMap[currentRoute] ?? null
            // get component
            return h(component)
        }
    })
}

export default customRouter