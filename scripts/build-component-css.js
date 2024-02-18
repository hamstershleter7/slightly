/*
 * 通过 dist 目录下的 style/index.js 构建每个组件的 css 文件
 * */
let path = require('path')
let vite = require('vite')
let glob = require('glob')
let fse = require('fs-extra')
let atImport = require('postcss-import')
let projectID = process.env.VITE_APP_PROJECT_ID

function scannerFiles() {
  let prefix = './dist/esm/'
  let list = glob.sync(prefix + '**/style/index.js', { dotRelative: true })
  return list
}

function viteConfig(file) {
  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(process.cwd(), './src') }],
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "@/styles/variables${projectID ? `-${projectID}` : ''
            }.scss";`,
        },
        postcss: {
          plugins: [atImport({ path: path.join(__dirname, 'src`') })],
        },
      },
    },
    build: {
      emptyOutDir: false,
      outDir: file.replace('index.js', ''),
      rollupOptions: {
        output: [
          {
            format: 'es',
            entryFileNames: 'css.js',
          },
        ],
      },
      lib: {
        entry: file,
        formats: ['es'],
      },
    },
  }
}

function build(files) {
  Promise.all(
    files.map((file) => {
      return vite.build(viteConfig(file))
    })
  ).then(() => {
    let fileList = glob.sync('./dist/esm/**/style.css', { dotRelative: true })
    fileList.forEach((file) => {
      fse.writeFile(file.replace('style.css', 'css.js'), `import './style.css'`)
    })
  })
}

build(scannerFiles())
