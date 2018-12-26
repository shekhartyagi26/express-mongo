var request = require('request');
var zlib = require('zlib');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var google = require('google');

const getHtml = (url) => {
    return new Promise((resolve, reject) => {
        var headers = {
            "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
            "accept-language": "en-US,en;q=0.8",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
            "accept-encoding": "gzip,deflate",
        };

        var options = {
            url: url,
            headers: headers,
            timeout: 60000
        };
        try {
            var req = request.get(options);
            req.on('response', function(res) {
                var chunks = [];
                res.on('data', function(chunk) {
                    chunks.push(chunk);
                });
                res.on('end', function() {
                    var buffer = Buffer.concat(chunks);
                    var encoding = res.headers['content-encoding'];
                    if (encoding == 'gzip') {
                        zlib.gunzip(buffer, function(err, decoded) {
                            resolve(decoded && decoded.toString());
                        });
                    } else if (encoding == 'deflate') {
                        zlib.inflate(buffer, function(err, decoded) {
                            resolve(decoded && decoded.toString());
                        })
                    } else {
                        resolve(buffer.toString());
                    }
                });
                res.on('error', function(err) {
                    reject(err);
                });
            });
            req.on('error', function(err) {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};

const getJsUrls = (response_data) => {
    let url_to_scrap = [];
    let $ = cheerio.load(response_data);
    links = $('script'); //jquery get all hyperlinks
    $(links).each(function(i, link) {
        link = $(link).attr('src');
        if (link) {
            link = link.substring(0, 2) == '//' ? link.replace('//', '') : link;
            url_to_scrap.push(link);
        }
    });
    return url_to_scrap;
};

const writeInFile = (fileName, dataToWrite) => {
    return fs.appendFileSync(fileName, `${dataToWrite}\n`);
}


const getHostName = (url) => {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}

const getEmails = (body) => {
    var search_in = body;
    string_context = search_in.toString();

    array_mails = string_context.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    array_mails = _.uniq(array_mails);
    return array_mails;

}

const fetchGoogleUrl = (string) => {
    return new Promise((resolve, reject) => {
        let links = [];
        google.resultsPerPage = 25;
        google.protocol = 'http' // searches google using http://www.google.com
        // google.protocol = 'https' // searches google using https://www.google.com
        google(string, function(err, res) {
            if (err) {
                console.log(err)
                // reject(err)
            } else {
                let results = res && res.links || [];
                if (results && results.length) {
                   results.map(result => {
                      if (result && result.link) {
                         // writeInFile('links.csv', result.link)
                         links.push(result.link);
                      }
                   });
                   resolve(links);
                } else {
                   reject("no links found");
                }
            }
        })
    })
}

const unwindArray = (data) => {
    let { emails, url, domainName } = data;
    let arr = [];
    emails.map((email) => {
        arr.push({ email, url, domainName });
    });
    return arr;
}

module.exports = {
    getHtml,
    getJsUrls,
    getEmails,
    writeInFile,
    getHostName,
    fetchGoogleUrl,
    unwindArray
};