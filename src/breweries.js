let cheerio = require('cheerio')
let rp = require('request-promise')
let Promise = require('bluebird')
let { header, subheader, logBreak } = require('./utils.js')

// simple!
// roll-your-own?
function burdock () {
  return rp('http://www.burdockto.com/bottleshop/').then((body) => {
    let $ = cheerio.load(body)
    header('Burdock:')
    $(body).find('#bottleshop .shop_beer_list').children('li').each((index, elem) => {
      let text = $(elem).find('.beer_overlay h4').text()
      console.log(text)
    })
  }).then(logBreak)
}

// parse/reformat text
// Wordpress
function greatLakes () {
  return rp('http://greatlakesbrewery.com').then((body) => {
    header('Great Lakes:')
    let $ = cheerio.load(body)
    $(body).find('h3:contains("IN STORE") + ul li').each((index, elem) => {
      let text = $(elem).text()
      // Full text: NAME - $9.99 | format
      let name = text.split('–')[0].trim()
      let format = text.split('|')[1].trim()
      console.log(`${name} (${format})`)
    })
  }).then(logBreak)
}

// odd markup - table formatting.
// Wordpress
function leftField () {
  return rp('http://www.leftfieldbrewery.ca/').then((body) => {
    let $ = cheerio.load(body)
    header('Left Field:')
    $(body).find('.atthebrewery__row').each((index, elem) => {
      let columns = $(elem).find('.columns')
      let inBottles = columns.eq(3).find('.check').length > 0
      let inCans = columns.eq(2).find('.check').length > 0

      if (inBottles || inCans) {
        let name = columns.first().find('.beer-title').text()
        let style = columns.eq(1).find('span').text()
        let format = inBottles ? 'bottle' : 'can'
        console.log(`${name} (${style}) - ${format}`)
      }
    })
  }).then(logBreak)
}

// nondescript markup
// Wordpress
function rainhard () {
  return rp('http://rainhardbrewing.com/beers/').then((body) => {
    let $ = cheerio.load(body)
    header('Rainhard:')
    $(body).find('.full_width_inner .grid_section').each((index, elem) => {
      let text = $(elem).find('.wpb_wrapper > h2').text()
      console.log(text)
    })
  }).then(logBreak)
}

// multiple URLs, each with its own markup (because of different content)
// Wordpress
function bellwoods () {
  let uris = ['product-category/bottleshop/', 'beer/available-in-the-brewpub/']
  let requests = uris.map((uri) => {
    return rp('http://bellwoodsbrewery.com/' + uri)
  })

  return Promise.all(requests).then((htmlBodies) => {
    header('Bellwoods:')
    bottleshop(htmlBodies[0])
    onTap(htmlBodies[1])
  }).then(logBreak)

  function bottleshop (body) {
    subheader('At the bottleshop:')
    let $ = cheerio.load(body)

    $(body).find('ul.products li.product a h3').each((index, elem) => {
      console.log($(elem).text())
    })
  }

  function onTap (body) {
    subheader('On tap:')
    let $ = cheerio.load(body)

    $(body).find('h1.post-title + div.ps-products ul.products li.product a h3').each((index, elem) => {
      console.log($(elem).text())
    })
  }
}

// different page per beer; multiple subsequent HTTP requests
// plus some user-agent wackiness
// now we're almost HATEOSing
// Squarespace
function folly () {
  let baseOpts = {
    headers: {
      'User-Agent': 'request'
    }
  }
  let options = Object.assign({}, baseOpts, {
    url: 'http://www.follybrewing.com'
  })

  return rp(options).then(function (body) {
    let $ = cheerio.load(body)
    let requests = $(body).find('#bottleshop-section .sqs-col-3 .intrinsic a').map((index, elem) => {
      let opts = Object.assign({}, baseOpts)
      opts.url = $(elem).attr('href').trim()
      return rp(opts)
    }).get()

    return Promise.all(requests).then((results) => {
      header('Folly Brewpub:')
      results.forEach((value) => {
        let $ = cheerio.load(value)
        let text = $(value).find('#content .sqs-block > .sqs-block-content > p > strong').text()
        let formatted = text.split('%')[0]
        console.log(`${formatted}%`)
      })
    })
  }).catch(function (err) {
    console.log(err)
  }).then(logBreak)
}

module.exports = {
  bellwoods,
  leftField,
  rainhard,
  folly,
  burdock,
  greatLakes
}
