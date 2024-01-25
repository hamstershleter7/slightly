let postcss = require('postcss')
let rtl = require('postcss-rtlcss')
let fs = require('fs')
let path = require('path')
let scss = require('postcss-scss')
let config = require('../src/config.json')

let components = config.nav.reduce(
  (prev, nav) => [...prev, ...nav.packages],
  []
)
console.log(components.length)

let plugins = [
  rtl({ mode: 'override', rtlPrefix: [`[dir="rtl"]`, `.nut-rtl`] }),
]

components.forEach((component) => {
  let componentName = component.name.toLowerCase()
  if (componentName === 'icon') return
  // if (componentName === 'icon' || componentName === 'col') return
  // if(componentName !== 'col') return
  let readFrom = path.join(
    process.cwd(),
    `./src/packages/${componentName}/${componentName}.scss`
  )
  let writeTo = path.join(
    process.cwd(),
    `./src/packages/${componentName}/${componentName}.scss`
  )
  let css = fs.readFileSync(readFrom, 'utf8')
  postcss(plugins)
    .process(css, { syntax: scss })
    .then((result) => {
      fs.writeFile(writeTo, result.css, () => {})
    })
})
