const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{ddd}}

export function generate(el) { // el 是AST语法树
  const children = genChildren(el)
  const code = `_c("${el.tag}",
        ${el.attrs.length ? genProps(el.attrs) : undefined // 设置标签属性时 有属性取属性否则取undefined
}
        ${children ? `,${children}` : ''
})
    `
  return code
}

function genChildren(el) { // 生成孩子 el.chilren 是可以使用的
  const { children } = el
  if (children && children.length) {
    return `${children.map((c) => gen(c)).join(',')}`
  }
  return false
}

function gen(node) { // node type 1 3 区别是元素节点还是文本节点 递归思想
  if (node.type === 1) {
    return generate(node)
  }
  const { text } = node
  // 到这一步仍需处理text 可能存在{{}}语法
  // a {{name}} b {{age}} c
  // 转化成
  // _v("a" + _S(name) + "b" + _s(age) + "c")
  // 正则存在lastIndex的问题，需重置为0 ？？？
  // 正则 exec 0: "{{name}}" 1: "name" index匹配文本的第一个字符的位置
  const tokens = [] // 待拼接的字符串数组
  let match; let
    index
  let lastIndex = defaultTagRE.lastIndex = 0

  while (match = defaultTagRE.exec(text)) {
    index = match.index
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    tokens.push(`_s(${match[1].trim()})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return `_v(${tokens.join('+')})`
}

function genProps(attrs) { // 生成属性  attrs:[{name: id, value: '**'}] => 多个{id: **}
  let str = ''
  attrs.forEach((item) => {
    if (item.name === 'style') {
      const obj = {}
      item.value.split(';').forEach((styleItem) => {
        if (styleItem) {
          const splitItem = styleItem.split(':')
          obj[splitItem[0]] = splitItem[1]
        }
      })
      str += `style: ${JSON.stringify(obj)},`
    } else {
      str += `${item.name}:${JSON.stringify(item.value)},`
    }
  })
  // return `{${str.substring(0, str.length - 1)}}`
  return `{${str.slice(0, -1)}}`
}
