var shell = require('shelljs')
var fs = require('fs')
var { join } = require('path')

var beforeTag = process.argv[2]
var nextTag = process.argv[3]

shell.exec(
  `git log -1 --format=%ai ${beforeTag}`,
  { silent: true },
  (code, stdout, stderr) => {
    shell.exec(
      `git log --since="${stdout.replace('\n', '')}" --pretty=format:"%s" next`,
      { silent: true },
      (code, stdout, stderr) => {
        var logs = stdout.split('\n')
        var rules = [
          'build',
          'chore',
          'ci',
          'docs',
          'feat',
          'fix',
          'perf',
          'refactor',
          'revert',
          'style',
          'test',
        ]
        var logsWithGithubUser = {
          build: [],
          chore: [],
          ci: [],
          docs: [],
          feat: [],
          fix: [],
          perf: [],
          refactor: [],
          revert: [],
          style: [],
          test: [],
          others: [],
        }
        var logSymbol = {
          build: '* 📦 ',
          chore: '* 🏡 ',
          ci: '* 🤖 ',
          docs: '* 📖 ',
          feat: '* :sparkles: ',
          fix: '* :bug: ',
          perf: '* zap: ',
          refactor: '* 🪵 ',
          revert: '* 🚦 ',
          style: '* :art: ',
          test: '* 💡 ',
          others: '* 🔔 ',
        }
        logs.forEach((log, index) => {
          if (log.indexOf(beforeTag) === -1) {
            var a = rules.filter((rule) => {
              return log.toLowerCase().startsWith(rule)
            })
            if (a.length) {
              logsWithGithubUser[a[0]].push(log)
            } else {
              logsWithGithubUser.others.push(log)
            }
          }
        })

        let changeLog = ''
        rules.forEach((rule) => {
          var logs = logsWithGithubUser[rule]
          if (!logs.length) return
          changeLog += `${logs.map((log) => `${logSymbol[rule]}${log}`).join('\n')}\n`
        })
        shell.exec(
          'date "+%Y-%m-%d"',
          { silent: true },
          (code, stdout, stderr) => {
            var res = `# ${nextTag}\n\`${stdout.replaceAll('\n', '')}\`\n\n\n${changeLog}\n\n`

            fs.writeFileSync(
              join(__dirname, '../CHANGELOG.md'),
              res +
                fs.readFileSync(join(__dirname, '../CHANGELOG.md'), {
                  encoding: 'utf8',
                })
            )
          }
        )
      }
    )
  }
)
