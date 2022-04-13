export let vue = null
import routerLink from './components/router-link'
import routerView from './components/router-view'

/**
 * install:
 * （1）注册全局组件 router-link router-view
 * （2）给所有子组件混入 router Vue.mixin
 * @param {*} _vue 
 */
const install = function (_vue) {
    vue = _vue
    vue.component('router-link', routerLink)
    vue.component('router-view', routerView)
    vue.mixin({
        beforeCreate() {
            if (this.$options?.router) { // 已经把custom-router类 挂载到vue实例了
                // @！！！废弃  vue.prototype.$router = this.$options.router // 这一步作用是将当前custom-router的挂在到vue原型上  挂载在原型，新的vue实例也能看到router
                this._routerRoot = this // 存放有router配置的vue根实例
                this._router = this.$options.router // 简短化 调用 传入router配置
                this._router.init(this)

                // 给 current 设置响应式(只能放在vue实例上去)
                // this._route 就是视图刷新的关键
                vue.util.defineReactive(this, '_route', this._router.history.current)
            } else {
                this._routerRoot = this.$parent && this.$parent._routerRoot // 递归创建_routerRoot属性
            }
        }
    })
    // vue原型上挂载方法，方便暴露API，给用户调用

    // vue.prototype.$route 是 当前组件的一些信息
    // 注意：不能在vue.mixin里 重新修改 vue.prototype
    Object.defineProperty(vue.prototype, '$route', {
        get () {
            return this._routerRoot._route
        }
    })

    // vue.prototype.$router 是 router实例上一些方法，如果是new vue()的新实例，
    // this._routerRoot值是没有的，是undefined。所以无需担心原型链污染
    Object.defineProperty(vue.prototype, '$router', {
        get () {
            return this._routerRoot._router
        }
    })
}
export default install
