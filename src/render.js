console.log('renderMixin.js');

export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        console.log('vm._render');
    }
}