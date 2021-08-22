import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalApi } from './initGlobalAPI/index'

function Vue(options) {
  // vue的初始化操作
  this._init(options)
}
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalApi(Vue)

export default Vue
