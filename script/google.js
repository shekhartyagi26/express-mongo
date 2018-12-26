var mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');
const async = require("async");
const puppeteer = require('puppeteer');
const Crawler = require('./modules/crawler');
const _ = require("lodash");
const { writeInFile, getHostName, getHtml, getJsUrls, getEmails, fetchGoogleUrl, unwindArray } = require('./modules/parser');
const Promise = require("bluebird");

let stringsConn;
let emailsConn;
const mongooseConnection = () => {
    mongoose.connect('mongodb://127.0.0.1/crawler', { useNewUrlParser: true });

    const conn = mongoose.connection;
    autoIncrement.initialize(conn);
    // ================== string schema =========================
    const stringSchema = mongoose.Schema({
        string: { type: String, required: true },
        createdAt: { type: Number, default: new Date().getTime() },
        updatedAt: { type: Number, default: new Date().getTime() },
    });

    stringSchema.plugin(autoIncrement.plugin, {
        model: 'strings',
        field: '_id',
        startAt: 100000,
        incrementBy: 1
    });
    stringsConn = conn.model("strings", stringSchema);
    // ================== string schema =========================

    // ================== string schema =========================
    const emailSchema = mongoose.Schema({
        email: { type: String, required: true },
        url: { type: String, required: true },
        domainName: { type: String, required: true },
        createdAt: { type: Number, default: new Date().getTime() },
        updatedAt: { type: Number, default: new Date().getTime() },
    });

    emailSchema.plugin(autoIncrement.plugin, {
        model: 'emails',
        field: '_id',
        startAt: 100000,
        incrementBy: 1
    });
    emailsConn = conn.model("emails", emailSchema);
    start();
}



function getJsUrl(url, callback) {
    (async () => {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        try {
            await page.goto(url);
            let html = await page.content();
            let url_to_scrap = getJsUrls(html)
            await browser.close();
            callback(url_to_scrap, html);
        } catch (error) {
            callback()
        }
    })();
}


const insertDocument = (results) => new Promise((resolve, reject) => {
    async.eachSeries(results, (result, cb) => {
        emailsConn.findOne(result)
            .then(document => {
                if (document) {
                    cb();
                } else {
                    emailsConn.create(result)
                        .then(insert => cb())
                        .catch(err => cb(err));
                }
            }).catch(err => cb(err));
    }, (err) => {
        if (err) reject(err);
        else resolve();
    })
})

function processUrlsDetails(url, callback) {
    let domainName = getHostName(url);
    let data = [];
    callback()
    // console.log(`********************* ${url} is going to processed *******************`)
    // getJsUrl(url, function(jsUrl, html) {
    //     var crawler = new Crawler().configure({ ignoreRelative: true, depth: process.env.DEPTH || 1 })
    //     crawler.crawl({
    //         url: url,
    //         jsUrl: jsUrl,
    //         success: function(page) {
    //             response_data = page.content ? page.content : page.response.req.res.body;
    //             let urlScrap = page.url;
    //             let emails = getEmails(response_data);
    //             if (emails && emails.length) data = data.concat(unwindArray({ url, domainName, emails }))
    //             console.log(data)
    //         },
    //         failure: function(page) {
    //             console.log('....')
    //         },
    //         finished: function(crawledUrls) {
    //             data = _.uniqWith(data, _.isEqual);
    //             insertDocument(data)
    //                 .then(() => {
    //                     console.log(`********************* ${url} is processed successfully *******************`)
    //                     callback()
    //                 })
    //                 .catch(err => callback(err))
    //         }
    //     });
    // })
}

const fetchUrl = async () => {
    if (string && string.string) {
        console.log(string.string)
        let urls = await fetchGoogleUrl(string.string);
        async.eachSeries(urls, processUrls, function(err) {
            if (err) {
                callback(err);
            } else {
                console.log('all are done!!!');
                stringCallBack();
            }
        });

        function processUrls(url, callback) {
            processUrlsDetails(url, function() {
                callback();
            })
        }
    } else {
        console.log(" no url found");
        start();
    }
}

let start = async () => {
    try {
        let strings = await stringsConn.find({}, { string: 1 });
        let result = await Promise.each(strings, async (string) => {
            console.log({string})
            let urls = await fetchGoogleUrl(string.string);

            await Promise.each(urls, processUrls);

            async function processUrls(url) {
                return new Promise((ress, rej) => {
                    processUrlsDetails(url, function() {
                        ress();
                    })
                })
            }
        })
        console.log("all string fetched successfully");
        start();

        // async.eachSeries(strings,  (string, stringCallBack) => {
        //     // if (string && string.string) {
        //         let urls = await fetchGoogleUrl(string.string);
        //     //     async.eachSeries(urls, processUrls, function(err) {
        //     //         if (err) {
        //     //             console.log(err)
        //     //             // callback(err);
        //     //         } else {
        //     //             console.log('all are done!!!');
        //     //             stringCallBack();
        //     //         }
        //     //     });

        //     //     function processUrls(url, callback) {
        //     //         processUrlsDetails(url, function() {
        //     //             callback();
        //     //         })
        //     //     }
        //     // } else {
        //     //     console.log(" no url found");
        //     //     start();
        //     // }
        // }, (err) => {
        //     if (err) console.log(err)
        //     else {
        //         console.log(":---")
        //         // start();
        //     }
        // })
    } catch (err) {
        console.log(err)
    }
}


mongooseConnection();