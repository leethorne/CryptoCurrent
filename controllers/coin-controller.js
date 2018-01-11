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

function getPage1() {
    return axios.get('https://coinranking.com/?page=1')
}

function getPage2() {
    return axios.get('https://coinranking.com/?page=2')
}

function getPage3() {
    return axios.get('https://coinranking.com/?page=3')
}

var coinArr = [];

function scrape (req, res) {

    axios.all([getPage1(), getPage2(), getPage3()])
        .then(axios.spread(function (page1, page2, page3) {

                var $ = cheerio.load(page1.data)
                console.log("logging $: ", $)

                var id = 0;
                var name$ = $('.coin-name')
                var imgUrl$ = $('.coin-list__body__row__cryptocurrency__prepend__icon__img')
                var price$ = $('.coin-list__body__row__price__value')
                var marketCap$ = $('.coin-list__body__row__market-cap__value')
                var change24$ = $('.coin-list__body__row__change')
                var trend = null;
                
                for (var i = 0; i < name$.length; i++) {
                    console.log('inside for loop')
                    if ($(change24$[i]).attr('class').includes("negative")) {
                        console.log('negative')
                        trend = "negative"
                    } else {
                        console.log('up')
                        trend = "up"
                    }
                    var newCoin = new Coin(
                        id++,
                        $(name$[i]).text(),
                        $(imgUrl$[i]).attr('src'),
                        parseFloat($(price$[i]).text().replace(/,/g, "")),
                        parseFloat($(marketCap$[i]).text().replace(/,/g, "")),
                        $(change24$[i]).text().trim(),
                        trend
                    )
                    coinArr.push(newCoin)
                }

                var $ = cheerio.load(page2.data)

                var name$ = $('.coin-name')
                var imgUrl$ = $('.coin-list__body__row__cryptocurrency__prepend__icon__img')
                var price$ = $('.coin-list__body__row__price__value')
                var marketCap$ = $('.coin-list__body__row__market-cap__value')
                var change24$ = $('.coin-list__body__row__change')
                var trend = null;

                for (var i = 0; i < name$.length; i++) {
                    if ($(change24$[i]).attr('class').includes("negative")) {
                        trend = "negative"
                    } else {
                        trend = "up"
                    }
                    var newCoin = new Coin(
                        id++,
                        $(name$[i]).text(),
                        $(imgUrl$[i]).attr('src'),
                        parseFloat($(price$[i]).text().replace(/,/g, "")),
                        parseFloat($(marketCap$[i]).text().replace(/,/g, "")),
                        $(change24$[i]).text().trim(),
                        trend
                    )
                    coinArr.push(newCoin)
                }

                var $ = cheerio.load(page3.data)

                var name$ = $('.coin-name')
                var imgUrl$ = $('.coin-list__body__row__cryptocurrency__prepend__icon__img')
                var price$ = $('.coin-list__body__row__price__value')
                var marketCap$ = $('.coin-list__body__row__market-cap__value')
                var change24$ = $('.coin-list__body__row__change')
                var trend = null;

                for (var i = 0; i < name$.length; i++) {
                    if ($(change24$[i]).attr('class').includes("negative")) {
                        trend = "negative"
                    } else {
                        trend = "up"
                    }
                    var newCoin = new Coin(
                        id++,
                        $(name$[i]).text(),
                        $(imgUrl$[i]).attr('src'),
                        parseFloat($(price$[i]).text().replace(/,/g, "")),
                        parseFloat($(marketCap$[i]).text().replace(/,/g, "")),
                        $(change24$[i]).text().trim(),
                        trend
                    )
                    coinArr.push(newCoin)
                }
                res.json(coinArr)
            }))
            .catch(function (error) {
                res.json(error)
            })
}

module.exports = { scrape }