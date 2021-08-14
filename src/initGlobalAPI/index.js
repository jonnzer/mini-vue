import { mergeOptions } from "../util/index"
export function initGlobalApi(Vue) {
    Vue.options = {}
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
    }
    //Vue.mixin({
    //    a: 1,
    //    b: 2,
    //    beforeCreate: function () {
    //        console.log('fn1')
    //    }
    //})
    //Vue.mixin({
    //    b: 3,
    //    c: 4,
    //    beforeCreate: function () {
    //        console.log('fn2')
    //    }
    //})
    //console.log(Vue.options);
}