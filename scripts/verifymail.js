#!/usr/bin/env node
let { execSync } = require('child_process')

let stdout = execSync('git config user.email').toString()

if (stdout && /@jd.com$/gi.test(stdout.replace(/^\s+|\s+$/g, ''))) {
  console.log('\x1B[31m%s\x1B[39m', 'ERROR:', '不能使用京东企业邮箱提交，请设置个人GitHub邮箱')
  console.log('提示： git config user.email xxxxxxxx@xx.com')
  process.exit(1)
} else {
  process.exit(0)
}
