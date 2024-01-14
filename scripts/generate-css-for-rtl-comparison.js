/*
 * 通过 dist 目录下的 style/index.js 构建每个组件的 css 文件
 * */
var path = require('path')
var fs = require('fs')
var postcss = require('postcss')
var sass = require('sass')
var rtl = require('postcss-rtlcss')
var config = require('../src/config.json')

var components = config.nav.reduce(
  (prev, nav) => [...prev, ...nav.packages],
  []
)
console.log(components.length)

var mixin = fs
  .readFileSync(path.join(__dirname, '../src/styles/mixins/text-ellipsis.scss'))
  .toString()
var variables = fs.readFileSync(
  path.join(__dirname, '../src/styles/variables.scss')
)

function postcssRemoveRtl() {
  return {
    postcssPlugin: 'postcss-remove-rtl',
    Once(root, postcss) {
      // Transform CSS AST here
      root.nodes.forEach((node, index) => {
        if (node.type === 'rule') {
          if (node.selector.indexOf('[dir=')> -1) {
            console.log(node.selector, index)
            node.remove()
          }
        }
      })
    },
  }
}

components.forEach((component) => {
  var componentName = component.name.toLowerCase()
  if (componentName === 'icon') return

  let content = fs
    .readFileSync(
      path.join(
        __dirname,
        `../src/packages/${componentName}/${componentName}.scss`
      )
    )
    .toString()
  let to = path.join(
    __dirname,
    `../src/packages/${componentName}/${componentName}.rtl.css`
  )
  var matched = content.match(/@import.*?[;][\n\r]?/gi)
  if (matched) {
    matched.forEach((m) => {
      if (m.indexOf('styles') > -1) {
        content = content.replace(m, mixin)
      } else {
        content = content.replace(m, '')
      }
    })
  }

  var res = sass.compileString(variables + content)
  postcss([
    postcssRemoveRtl(),
    rtl({
      mode: 'override',
      rtlPrefix: [`[dir="rtl"]`, `.nut-rtl`],
    }),
  ])
    .process(res.css, { to })
    .then((result) => {
      fs.writeFile(to, result.css, () => {})
    })
})
