let checkBrewery = require('./src/main.js')
let args = process.argv.slice(2)
let defaultArgs = ['bellwoods', 'left-field', 'burdock', 'rainhard', 'folly', 'great-lakes']

if (args.length === 0) {
  defaultArgs.forEach(function (brewery) {
    checkBrewery(brewery)
  })
} else {
  checkBrewery(args[0])
}
