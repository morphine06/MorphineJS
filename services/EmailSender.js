'use strict';

var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');


module.exports = {
    send: function(res, to, subject, template, data, options, cb) {
        const nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
            host: morphineserver.config.app.mailjet_host,
            port: morphineserver.config.app.mailjet_port,
            // secure: true, // use SSL
            auth: {
                user: morphineserver.config.app.mailjet_user,
                pass: morphineserver.config.app.mailjet_pass
            }
        }) ;
        transporter.use('compile', htmlToText());

        data.layout = 'mails/layout' ;
        res.render(template, data, function(err, final_html) {
            if (err) throw err; // TODO: handle errors better
            let mailOptions = {
                from: morphineserver.config.app.mail_from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: final_html, // plain text body
                // html: '<b>Hello world ?</b>' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log(error);
                else console.log('Message %s sent: %s', info.messageId, info.response);
                cb() ;
            });

        });
    }
} ;


