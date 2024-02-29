// replace types alias for build
let vfs = require('vinyl-fs')
let map = require('map-stream')
let fs = require('fs-extra')
let exportPropsTypes = require('../export-props')
let package = require('../../package.json')
let dest_docs = './dist/types'

vfs
  .src(['./dist/esm/types/src/packages/nutui.react.taro.d.ts'])
  .pipe(
    map((file, cb) => {
      let contents = file.contents
        .toString()
        // .replaceAll('@/packages', `.`)
        .replace(/^@\/packages/g, `.`)
        .replace(/import\s(.*)?\.scss\'\;[\t\n]/g, '')
      file.contents = Buffer.from(contents, 'utf8')
      cb(null, file)
    })
  )
  .pipe(vfs.dest(dest_docs, { overwrite: true }))
  .on('end', () => {
    vfs
      .src([
        './dist/esm/types/src/packages/**/*.taro.d.ts',
        '!./dist/esm/types/src/packages/*.taro.d.ts',
      ])
      .pipe(
        map((file, cb) => {
          let contents = file.contents
            .toString()
            // .replaceAll('@/packages', `..`)
            .replace(/^@\/packages/g, `..`)
          file.contents = Buffer.from(contents, 'utf8')
          cb(null, file)
        })
      )
      .pipe(vfs.dest(dest_docs, { overwrite: true }))
      .on('end', () => {
        fs.remove('./dist/esm/types')
        fs.move(
          './dist/types/nutui.react.taro.d.ts',
          './dist/types/nutui.react.d.ts',
          (err) => {
            console.log('重命名失败', err)
            exportPropsTypes('taro')
          }
        )
      })
  })
