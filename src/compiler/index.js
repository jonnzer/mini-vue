// AST 虚拟dom
import { parserHTML } from "./parser-html"
import { generate } from "./generate"

export function compileToFunction(template) {
    // (1) 解析html字符串 => AST语法树
    let root = parserHTML(template)
    // AST语法树 => render函数
    // 原理：模版引擎？？？

    // html字符串： <div id="app"><p>hello {{name}}</p> test</div>
    // render函数： _c("div", {id: app}, _c("p", undefined, _v('hello' + _s(name))), _v('hello'))

    let code = generate(root)
    // 所有的模板引擎的实现 底层原理  new Function () {}  with

    let renderFn = new Function(`with(this){ return ${code}}`)

    // renderFn返回的是虚拟dom
    return renderFn
}