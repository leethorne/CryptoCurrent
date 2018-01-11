const cheerioAdv = require('cheerio-advanced-selectors');
const cheerio = cheerioAdv.wrap(require('cheerio'));
const axios = require('axios');


function Coin(id, name, imgUrl, price, marketCap, change24, trend) {
    this.id = id,
    this.name = name;
    this.imgUrl = imgUrl;
    this.price = price;
    this.marketCap = marketCap;
    this.change24 = change24;
    this.trend = trend;
}


var coinArr = [];
var id = 0;

var pages = [
    'https://coinranking.com/?page=1', 
    'https://coinranking.com/?page=2',
    'https://coinranking.com/?page=3'
]

function scrape (req, res) {

    axios.all(pages.map(p => axios.get(p)))
        .then(axios.spread(function(...response) {

            var pageArr = [];

            for (var i = 0; i < response.length; i++) {
                pageArr.push(response[i].data)
            }

            for (var i = 0; i < pageArr.length; i++) {

                var $ = cheerio.load(pageArr[i])
                console.log("logging $: ", $)

                var name$ = $('.coin-name')
                var imgUrl$ = $('.coin-list__body__row__cryptocurrency__prepend__icon__img')
                var price$ = $('.coin-list__body__row__price__value')
                var marketCap$ = $('.coin-list__body__row__market-cap__value')
                var change24$ = $('.coin-list__body__row__change')
                var trend = null;

                for (var j = 0; j < name$.length; j++) {
                    console.log('inside for loop')
                    if ($(change24$[j]).attr('class').includes("negative")) {
                        console.log('negative')
                        trend = "negative"
                    } else {
                        console.log('up')
                        trend = "up"
                    }
                    var newCoin = new Coin(
                        id++,
                        $(name$[j]).text(),
                        $(imgUrl$[j]).attr('src'),
                        parseFloat($(price$[j]).text().replace(/,/g, "")),
                        parseFloat($(marketCap$[j]).text().replace(/,/g, "")),
                        $(change24$[j]).text().trim(),
                        trend
                    )
                    coinArr.push(newCoin)
                }
            }
                res.json(coinArr)
            }))
            .catch(function (error) {
                res.json(error)
            })
}

module.exports = { scrape }