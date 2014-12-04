'use strict';
var cheerio = require('cheerio'),
    request = require('request');

var args = process.argv.slice(2);

var message = null;

switch (args[0]) {
  case 'bellwoods':
    request("http://bellwoodsbrewery.com/product-category/bottleshop/",
      function(err, res, body) {
        var $ = cheerio.load(body);
        var beers = {};
        console.log('At the bottleshop:\n');
        $(body).find('ul.products li.product a').each(function(index, elem) {
          var href = $(this).attr('href');
          var hrefArr = href.split('/');
          var nameKey = hrefArr.slice(-2, -1)[0];
          var nameReadable = nameKey.replace('-', ' ')
            .replace(/(^|\s)(\w)/g, function(match, p1, p2) {
              return match.replace(p2, p2.toUpperCase());
            });
          beers[nameKey] = nameReadable;
        });
        for (var prop in beers) {
          if (beers.hasOwnProperty(prop)) {
            console.log(beers[prop]);
          }
        }
        console.log('\n');
    });

    request('http://bellwoodsbrewery.com/beer/available-in-the-brewpub/',
      function(err, res, body) {
        var $ = cheerio.load(body);
        var beers = {};
        console.log('On tap:\n');
        $(body).find('h1.post-title + div.ps-products ul.products li.product a h3')
          .each(function(index, elem) {
            // var href = $(this).attr('href');
            // var hrefArr = href.split('/');
            // var nameKey = hrefArr.slice(-2, -1)[0];
            // var nameReadable = nameKey.replace('-', ' ')
            //   .replace(/(^|\s)(\w)/g, function(match, p1, p2) {
            //     return match.replace(p2, p2.toUpperCase());
            //   });
            // beers[nameKey] = nameReadable;
            beers[index] = $(this).text();
          });
        for (var prop in beers) {
          if (beers.hasOwnProperty(prop)) {
            console.log(beers[prop]);
          }
        }
    });
    break;
  default:
    break;
}
