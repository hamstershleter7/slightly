let path = require('path')
let ts = require('rollup-plugin-ts')

let cwd = __dirname

let base = {
  external: ['@tarojs/service'],
  plugins: [ts()],
}

// 供 CLI 编译时使用的 Taro 插件入口
let compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
  },
  ...base,
}

module.exports = [compileConfig]
