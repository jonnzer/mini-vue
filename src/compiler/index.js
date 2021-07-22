// AST 虚拟dom
import { parserHTML } from "./parser-html"


export function compileToFunction(template) {
    // (1) 解析html字符串 => AST语法树
    let root = parserHTML(template)
    console.log(root)
    return function render() {

    }
}