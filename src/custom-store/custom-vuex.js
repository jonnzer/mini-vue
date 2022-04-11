/* eslint-disable */

// custom-vuex的原理
let vue;
class Store {
    constructor(userOptions) { // userOptions: 用户传进的vuex配置
        // 这里this指向Store实例
        this.$options = userOptions // 传进来的vuex配置
        console.log('userOptions: ', userOptions)
        this._mutations = userOptions.mutations
        this._actions = userOptions.actions
        this._getters = userOptions.getters
        this.getters = {}
        let computed = {} // 让getter触发在vue的compued里

        // getters
        const storeScope = this
        Object.keys(this._getters).forEach(getterKey => {
            // 获取getter中的所有函数
            let fn = storeScope._getters[getterKey]
            computed[getterKey] = function() {
                return fn(storeScope.state)
            }

            // getter无需设置set属性 
            // (辅助理解) this.$store.getters.prop === this.getters.prop ===  this.state.prop(vue computed prop)
            Object.defineProperty(storeScope.getters, getterKey, {
                get: () => {
                    return storeScope.state[getterKey]
                }
            })
        })
        
        // 代理 this.data.count => this.count 在vue的响应式有提过
        // 方便这里调用 this.state.count，而且是响应式结构
        // 注意：仅仅需要代理 this.state结构，其他是不用的
        this.state = new vue({
            data: userOptions.state,
            computed: computed
        })
        
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    commit (type, payload) {
        this._mutations[type] && this._mutations[type](this.state, payload)
    }

    dispatch (type, payload) {
        this._actions[type] && this._actions[type](this)
    }
}
function install (_vue) {
    vue = _vue
    vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                vue.prototype.$store = this.$options.store
            }
        }
    })
}
export default {
    install,
    Store
}