var fse = require('fs-extra')
var config = require('../../src/config.json')
var targetBaseUrl = `${process.cwd()}/packages`
var taroConfig = `${targetBaseUrl}/nutui-taro-demo/src/app.config.ts`

// 创建 config
var createConfig = async () => {
  let configRef = []

  return new Promise((res, rej) => {
    config.nav.map((item) => {
      let co = {
        root: item.enName,
        pages: [],
      }

      item.packages.map((it) => {
        if (!(it.exportEmpty == false) && it.show && it.taro) {
          co.pages.push(`pages/${it.name.toLowerCase()}/index`)
        }
      })
      co = { ...co, pages: co.pages.sort() }
      configRef.push(co)
    })
    res(configRef)
  })
}

var create = async () => {
  var subpackages = await createConfig()
  fse.writeFileSync(
    taroConfig,
    `
var subPackages = ${JSON.stringify(subpackages, null, 2)};\n
export default defineAppConfig ({
  pages: ['pages/index/index'],
  subPackages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'NutUI-React',
    navigationBarTextStyle: 'black'
  }
})`,
    'utf8'
  )
}

create()
