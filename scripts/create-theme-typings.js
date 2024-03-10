var glob = require('glob')
var path = require('path')
var fse = require('fs-extra')
var prettier = require('prettier')
var projectID = process.env.VITE_APP_PROJECT_ID

var UPPERCASE = /[\p{Lu}]/u
var LOWERCASE = /[\p{Ll}]/u
var LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu
var IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u
var SEPARATORS = /[_.\- ]+/

var LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source)
var SEPARATORS_AND_IDENTIFIER = new RegExp(
  SEPARATORS.source + IDENTIFIER.source,
  'gu'
)
var NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu')

var preserveCamelCase = (
  string,
  toLowerCase,
  toUpperCase,
  preserveConsecutiveUppercase
) => {
  let isLastCharLower = false
  let isLastCharUpper = false
  let isLastLastCharUpper = false
  let isLastLastCharPreserved = false

  for (let index = 0; index < string.length; index++) {
    var character = string[index]
    isLastLastCharPreserved = index > 2 ? string[index - 3] === '-' : true

    if (isLastCharLower && UPPERCASE.test(character)) {
      string = string.slice(0, index) + '-' + string.slice(index)
      isLastCharLower = false
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = true
      index++
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      LOWERCASE.test(character) &&
      (!isLastLastCharPreserved || preserveConsecutiveUppercase)
    ) {
      string = string.slice(0, index - 1) + '-' + string.slice(index - 1)
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = false
      isLastCharLower = true
    } else {
      isLastCharLower =
        toLowerCase(character) === character &&
        toUpperCase(character) !== character
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper =
        toUpperCase(character) === character &&
        toLowerCase(character) !== character
    }
  }

  return string
}

var preserveConsecutiveUppercase = (input, toLowerCase) => {
  LEADING_CAPITAL.lastIndex = 0

  return input.replace(LEADING_CAPITAL, (m1) => toLowerCase(m1))
}

var postProcess = (input, toUpperCase) => {
  SEPARATORS_AND_IDENTIFIER.lastIndex = 0
  NUMBERS_AND_IDENTIFIER.lastIndex = 0

  return input
    .replace(SEPARATORS_AND_IDENTIFIER, (_, identifier) =>
      toUpperCase(identifier)
    )
    .replace(NUMBERS_AND_IDENTIFIER, (m) => toUpperCase(m))
}

function camelCase(input, options) {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`')
  }

  options = {
    pascalCase: false,
    preserveConsecutiveUppercase: false,
    ...options,
  }

  if (Array.isArray(input)) {
    input = input
      .map((x) => x.trim())
      .filter((x) => x.length)
      .join('-')
  } else {
    input = input.trim()
  }

  if (input.length === 0) {
    return ''
  }

  var toLowerCase =
    options.locale === false
      ? (string) => string.toLowerCase()
      : (string) => string.toLocaleLowerCase(options.locale)

  var toUpperCase =
    options.locale === false
      ? (string) => string.toUpperCase()
      : (string) => string.toLocaleUpperCase(options.locale)

  if (input.length === 1) {
    if (SEPARATORS.test(input)) {
      return ''
    }

    return options.pascalCase ? toUpperCase(input) : toLowerCase(input)
  }

  var hasUpperCase = input !== toLowerCase(input)

  if (hasUpperCase) {
    input = preserveCamelCase(
      input,
      toLowerCase,
      toUpperCase,
      options.preserveConsecutiveUppercase
    )
  }

  input = input.replace(LEADING_SEPARATORS, '')
  input = options.preserveConsecutiveUppercase
    ? preserveConsecutiveUppercase(input, toLowerCase)
    : toLowerCase(input)

  if (options.pascalCase) {
    input = toUpperCase(input.charAt(0)) + input.slice(1)
  }

  return postProcess(input, toUpperCase)
}

function generate() {
  var files = [
    !projectID
      ? './src/styles/variables.scss'
      : `./src/styles/variables-${projectID}.scss`,
    ...glob.sync('./src/packages/**/*.scss', {
      ignore: './src/**/demo.scss',
      dotRelative: true
    }),
  ]
  Promise.all(
    files.map(function (file) {
      return fse.readFile(path.join(process.cwd(), file)).then((data) => {
        if (!data) return []
        return matchCssVarFromText(data.toString())
      })
    })
  ).then((data) => {
    var result = data.reduce((pre, curr) => {
      return [...pre, ...curr]
    }, [])
    var unique = Array.from(new Set(result))

    var formatStrFunc = async () => {
      var str = await prettier.format(`export type NutCSSVariables = ${unique.join('|')}`, {
        trailingComma: 'es5',
        semi: false,
        singleQuote: true,
        endOfLine: 'auto',
        parser: 'typescript',
      })

      fse.writeFile(
        path.join(process.cwd(), './src/packages/configprovider/types.ts'),
        str
      )
    }

    formatStrFunc()
  })
}

function matchCssVarFromText(text) {
  if (!text) return []
  var matched = text.match(/--nutui[\w\-]*/gi)
  if (!matched) return []
  var variables = matched.map((cssVar) => `'${camelCase(cssVar)}'`)
  return variables
}

generate()
