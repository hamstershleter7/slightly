let path = require('path')
let fse = require('fs-extra')

let themeDir = path.join(__dirname, '../dist/theme-react')
let siteDir = path.join(process.cwd(), '../nutui-site/dist')

fse.copy(themeDir, path.join(siteDir, 'theme-react'))
