const _ = require("lodash");
const twilio = require('twilio');
const nodemailer = require("nodemailer")
const constant = require('./constant');
const responses = require('./responses');
const smtpTransport = require("nodemailer-smtp-transport");

exports.generateRandomString = () => {
    let text = "";
    let possible = "123456789";
    for (var i = 0; i < 4; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.checkKeyExist = (object) => {
    let err = {};
    let data = {};
    _.forEach(object, (value, key) => {
        if (value) {
            data[key] = value;
            if (key == "mobile") {
                if (!validatePhone(value) || value.length != 10) {
                    err[key] = `invalid  ${key}`;
                }
            } else if (key == "email") {
                if (!validateEmail(value)) {
                    err[key] = `invalid  ${key}`;
                }
            } else if (key == "password") {
                if (value.length < 6 || value.length > 10) {
                    err[key] = `invalid  ${key}`;
                }
            } else if (key == "name") {
                if (value.length == 0) {
                    err[key] = `invalid  ${key}`;
                }
            }
        } else {
            err[key] = `invalid  ${key}`;
        }
    })
    if (err && _.size(err))
        return { status: false, data: err }
    else
        return { status: true, data: data }
}

const validatePhone = (phone) => {
    var pattern = /^\d{10}$/;
    return pattern.test(phone);
}
const validateEmail = (email) => {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return pattern.test(email);
}

exports.sendmail = function (email_id, html) {
    console.log({ email_id, html })
    var config = {
        "SMTP_HOST": "smtp.sendgrid.net",
        "SMTP_PORT": 25,
        "SMTP_USER": "apikey",
        "SMTP_PASS": "key",
        "SMTP_PASS": aaaaaaaaaa //
    }
    var mailer = nodemailer.createTransport(smtpTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
        }
    }));

    mailer.sendMail({
        from: "", // from email id
        to: email_id,
        subject: "success",
        template: "text",
        html: " Your verification code is :" + html
    }, (error, response) => {
        if (error) {
            console.log("+++++++eoor" + error);
        } else {
            console.log("++++success" + response);
        }
        mailer.close();
    });
}

exports.sendotp = function (varification_code) {
    var twilio = require('twilio');
    var client = new twilio(config.accountSid, config.authToken);
    client.messages.create({
        body: "your one time password(OTP) is  " + varification_code + "  valid for 3 minutes do not disclose it",
        to: '', // Text this number
        from: '' // From a valid Twilio number
    }).then((message) => console.log(message.sid));
}