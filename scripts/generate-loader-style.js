var config = require('../src/config.json')
var path = require('path')
var fse = require('fs-extra')
var fs = require('fs')
var projectID = process.env.VITE_APP_PROJECT_ID
var components = []

config.nav.forEach((c) => {
  c.packages.forEach((p) => {
    components.push(p.name)
  })
})

config.nav.map((item) => {
  item.packages.forEach((element) => {
    let { name, show, exportEmpty, exclude } = element
    if (exclude) return
    var nameLowerCase = name.toLowerCase()

    var file = path.resolve(process.cwd(), `dist/esm/${name}/style/index.js`)
    if (show || exportEmpty) {
      var componentSassFile = path.join(
        __dirname,
        `../dist/packages/${nameLowerCase}/${nameLowerCase}.scss`
      )
      // 这里匹配 @import，并转换为 require()
      let data = fs.readFileSync(componentSassFile, {
        encoding: 'utf8',
        flag: 'r',
      })
      var matched = data.match(/@import.*?[;][\n\r]?/gi)

      let rewrite = ''
      if (matched && matched.length) {
        rewrite = matched.map((im) => {
          if (im.indexOf('../../styles/') > -1) {
            if (im.indexOf('.css') > -1) {
              data = data.replace(im, '')

              return im
                .toLowerCase()
                .replace('@import ', `import`)
                .replace('../../', '../../../')
            }
            return ''
          } else {
            data = data.replace(im, '')
            // 补全文件扩展名
            if (im.indexOf('.scss') == -1) {
              im = im.replace("';", ".scss';")
            }
            // 引入的组件转换
            var matchGroup = im.match(/\.\.\/(?<package>[a-z]+)\//)
            if (matchGroup && matchGroup.groups && matchGroup.groups.package) {
              var find = components.filter(
                (c) => c.toLowerCase() == matchGroup.groups.package
              )[0]
              if (find) {
                return `import '../../${find}/style'`
              }
            }

            // 替换为 js 文件内容
            return im
              .toLowerCase()
              .replace('@import ', `import`)
              .replace('../', '../../../packages/')
              .replace("'./", `'../../../packages/${nameLowerCase}/`)
          }
        })
        rewrite = rewrite.join('\r\n')
        fse.outputFileSync(componentSassFile, data)
      }
      if (nameLowerCase === 'icon') {
        rewrite =
          `import '../../../styles/font${
            projectID ? `-${projectID}` : ''
          }/iconfont.css'\n` + rewrite
      }
      fse.outputFileSync(
        file,
        `${rewrite}${'\n'}import '../../../packages/${nameLowerCase}/${nameLowerCase}.scss'`
      )
    }
  })
})
