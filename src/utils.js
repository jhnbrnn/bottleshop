let colors = require('colors')

function logBreak () {
  console.log(colors.bgCyan('\n-------'))
}

function header (text) {
  console.log('\n' + colors.green(text) + '\n')
}

function subheader (text) {
  console.log(colors.blue(text))
}

module.exports = {
  logBreak,
  header,
  subheader
}
