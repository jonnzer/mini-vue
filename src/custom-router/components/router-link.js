export default {
    name: 'router-link',
    props: {
        to: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            default: 'a'
        }
    },
    methods: {
        clickHandler(e) {
            if (this.tag !== 'a') {
                this.$router.push(this.to)
            } else {
                console.log(e)
            }
        }
    },
    render(h) {
        // 参数1 标签  参数2 属性  参数3 子级
        // this 指向 当前router-link组件
        let tag = this.tag
        return h(tag, { attrs: { href: '#' + this.to }, class: 'router-link', on: { click: this.clickHandler } }, this.$slots.default)
    }
}