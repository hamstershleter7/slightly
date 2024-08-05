var markdownIt = require('markdown-it')()
var fs = require('fs')
var path = require('path')
var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')

function convertMdTables(inputFile, outputFile) {
  var mdText = fs.readFileSync(inputFile, 'utf8')

  let html = markdownIt.render(mdText)

  // 在 HTML 中查找表格，并将其转换为数组
  var tables = html.match(/<table[\s\S]*?<\/table>/g)
  // 将数组中的每个表格转换为对象
  var tableObjects = tables.map((table) => {
    var rows = table.match(/<tr[\s\S]*?<\/tr>/g)
    var headers = rows[0].match(/<th[\s\S]*?<\/th>/g).map((th) => {
      return th.replace(/<\/?th>/g, '')
    })
    var bodyRows = rows.slice(1).map((row) => {
      var cells = row.match(/<td[\s\S]*?<\/td>/g).map((td) => {
        return td.replace(/<\/?td>/g, '')
      })
      var rowObj = {}
      headers.forEach((header, index) => {
        rowObj[header] = cells[index]
      })
      return rowObj
    })
    return bodyRows
  })

  // html 转 markdown 的初始化
  var turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  })
  turndownService.use(turndownPluginGfm.gfm)

  // 单元格格式处理
  var formatRow = (row) => {
    var waitForFormat = [
      '类型',
      '默认值',
      'Type',
      'Default',
      'Default Value',
      '類型',
      '默認值',
    ]
    waitForFormat.forEach((key) => {
      if (row[key]) {
        row[key] =
          '`' + row[key].replace(/<\/?code>/g, '').replace(/\|/g, '\\|') + '`'
      }
    })
    Object.keys(row).forEach((key) => {
      if (row[key].indexOf('<code>') > -1) {
        row[key] = row[key].replace(/<\/?code>/g, '`').replace(/\|/g, '\\|')
      }
      if (row[key] === '') {
        row[key] = '`-`'
      }
    })
    return row
  }
  // 将表格对象转换为 Markdown 格式的表格
  var mdTables = tableObjects.map((table) => {
    var headers = Object.keys(table[0])
    var correctTable = table.map((row) => {
      return formatRow(row)
    })
    var headerRow = `| ${headers.join(' | ')} |\n|${headers
      .map(() => ' --- ')
      .join('|')}|\n`
    var bodyRows = correctTable
      .map(
        (row) =>
          `| ${Object.values(row)
            .map((val) => val.replace('|', '\\|'))
            .join(' | ')
            .replace('&gt;', '>')} |`
      )
      .join('\n')

    return markdownIt.render(`${headerRow}${bodyRows}`)
  })

  // 将 Markdown 表格插入回 Markdown 文本中
  mdTables.forEach((mdTable, index) => {
    html = html.replace(tables[index], mdTable)
  })

  // 将 HTML 转换回 Markdown
  var md = turndownService.turndown(html)
  fs.writeFileSync(outputFile, md, 'utf8')
}

var fileType = ['doc.md', 'doc.en-US.md', 'doc.zh-TW.md', 'doc.taro.md']
var component = process.argv[2]
var basePath = path.join(
  __dirname,
  `../src/packages/${component.toLowerCase()}/`
)

if (!component) return console.error('Required component name')
fileType.forEach((file) => {
  convertMdTables(path.join(basePath, file), path.join(basePath, file))
})
