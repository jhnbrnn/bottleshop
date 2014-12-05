let Breweries = require('./breweries.js')

function checkBrewery (arg) {
  switch (arg) {
    case 'bellwoods':
      return Breweries.bellwoods()
    case 'left-field':
      return Breweries.leftField()
    case 'burdock':
      return Breweries.burdock()
    case 'rainhard':
      return Breweries.rainhard()
    case 'folly':
      return Breweries.folly()
    case 'great-lakes':
      return Breweries.greatLakes()
    // case 'blood-brothers':
    //  NO WEBSITE
    // case 'granite':
    //  NO BOTTLESHOP
    // case 'amsterdam':
    //  BEERMENUS
    // case 'bandit':
    //
    // case 'halo':
    // TODO
    default:
      break
  }
}

module.exports = checkBrewery
