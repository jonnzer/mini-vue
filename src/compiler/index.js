// AST 虚拟dom
import { parserHTML } from "./parser-html"

function generate(el) { // el 是AST语法树
    console.log(el);
    let code = `_c("${el.tag}", ${el.attrs.length ? genProps(el.attrs) : undefined // 设置标签属性时 有属性取属性否则取undefined
        })

    `
    return code
}

function genProps(attrs) { // 生成属性  attrs:[{name: id, value: '**'}] => 多个{id: **}
    let str = ''
    attrs.forEach(item => {
        if (item.name === 'style') {
            let obj = {}
            item.value.split(';').forEach((styleItem) => {
                if (styleItem) {
                    let splitItem = styleItem.split(':')
                    obj[splitItem[0]] = splitItem[1]
                }
            })
            str += `{style: ${JSON.stringify(obj)}}`
        } else {
            str += `{${item.name}:${item.value}},`
        }
    })
    return str.substring(0, str.length - 1)
}

export function compileToFunction(template) {
    // (1) 解析html字符串 => AST语法树
    let root = parserHTML(template)
    // AST语法树 => render函数
    // 原理：模版引擎？？？

    // html字符串： <div id="app"><p>hello {{name}}</p> test</div>
    // render函数： _c("div", {id: app}, _c("p", undefined, _v('hello' + _s(name))), _v('hello'))

    let code = generate(root)
    console.log(code);
    return function render() {

    }
}