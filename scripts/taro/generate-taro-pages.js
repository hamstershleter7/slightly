var fse = require('fs-extra')
var path = require('path')
var fs = require('fs')
var config = require('../../src/config.json')
var navs = config.nav

// let fileStr = `@import '../../../styles/font/iconfont.css';`
// var projectID = process.env.VITE_APP_PROJECT_ID
// if (projectID) {
//   fileStr = `@import '../../../styles/font-${projectID}/iconfont.css';`
// }

// 在mobile-taro下创建相应的文件夹，并创建index.config.ts、index.tsx
// 将packages下的demo.taro.tsx 的内容拷贝到 mobile-taro 下的 index.tsx 中。
var createIndexConfig = (enName, package) => {
  return new Promise((resolve, reject) => {
    if (package.show && package.taro) {
      var name = package.name
      var nameLc = package.name.toLowerCase()
      let content = `export default {
  navigationBarTitleText: '${name}',
}`
      var dirPath = path.join(
        __dirname,
        `../../packages/nutui-taro-demo/src/${enName}/pages/${nameLc}`
      )
      var filePath = path.join(dirPath, `index.config.ts`)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }, (err) => {
          console.log('mkdir error', err)
        })
      }

      fs.writeFile(filePath, content, (err) => {
        if (err) {
          throw err
        }
        resolve(`生成index.config.ts文件成功`)
      })

      // 生成 demo
      var demoContent = `import Demo from '@/packages/${nameLc}/demo.taro';
export default Demo;`
      var demoDirPath = path.join(
        __dirname,
        `../../packages/nutui-taro-demo/src/${enName}/pages/${nameLc}`
      )
      var demoFilePath = path.join(demoDirPath, `index.tsx`)
      if (!fs.existsSync(demoDirPath)) {
        fs.mkdirSync(demoDirPath, { recursive: true }, (err) => {
          console.log('mkdir error', err)
        })
      }
      fs.writeFile(demoFilePath, demoContent, (err) => {
        if (err) {
          throw err
        }
        resolve(`生成 index.tsx 文件成功`)
      })
    }
  })
}

var replaceAppSCSS = () => {
  var dirPath = path.join(__dirname, `../../packages/nutui-taro-demo/src`)
  var filePath = path.join(dirPath, `app.scss`)
  fse.readFile(filePath, (err, data) => {
    if (!err) {
      let fileString = data.toString()
      var lines = fileString.split('\n')
      if (lines[0].indexOf(`@import '../../../styles/font`) !== -1) {
        lines[0] = ''
      }
      fse.outputFile(filePath, fileString, 'utf8', (error) => {
        if (error) console.log('Error', error)
      })
    }
  })
}

function create() {
  navs.map((nav) => {
    nav.packages.map((package) => {
      return createIndexConfig(nav.enName, package)
    })
  })
  replaceAppSCSS()
}

create()
