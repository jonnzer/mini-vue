// AST 虚拟dom

// 需要的正则
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`        // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`  // <aa:bb>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 <sss 捕获的内容是标签名
const startTagClose = /^\s*(\/?)>/                   // 匹配标签结束的 >  <div>   
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/   // 匹配属性 id="idName"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g         // {{ddd}} 


// 模板字符串：
// <div id="app">
//  <p>{{name}}</p>
// </div>

//advance(***[0].length) 是regExp.match匹配返回第一个参数 
function parserHTML(html) { // 解析HTMLDOM文本 => DOM树（包含属性、子节点、父节点）
    function parsestartTag() { // 解析开始标签
        let start = html.match(startTagOpen) // 匹配开始标签头
        if (start) {
            advance(start[0].length) // start[0]: <div  将标签从模板字符串中删除
            const match = {
                tagName: start[1], // 'div'
                attrs: []
            }
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 如果剩下的匹配不到结束标签，则视为有属性，处理属性值的返回
                advance(attr[0].length) // 将开始标签的属性从模板字符串中删除
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
            }
            if (end) {
                advance(end[0].length) // 删除开始标签的>
                return match // 这才是真正return到外面的结果
            }
        }
    }
    function advance(n) { // 前进n位 处理html解析的不断更新字符串
        html = html.substring(n)
    }

    while (html) { // while 只要循环条件为真，一直执行的特点
        let textEnd = html.indexOf('<')
        if (textEnd === 0) { // 是标签的左边 包含开始标签 和结束标签
            let startTagMatch = parsestartTag() // startTagMatch 包含tagName attrs
            if (startTagMatch) {
                console.log(startTagMatch);
                continue // 开始标签匹配完毕后  继续下一次 匹配
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                continue
            }
        }
        let text
        if (textEnd >= 0) { // 包含空白节点的情况
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
        }
    }


}

export function compileToFunction(template) {
    let root = parserHTML(template)
    return function render() {

    }
}