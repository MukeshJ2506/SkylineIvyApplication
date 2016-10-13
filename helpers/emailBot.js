var nodemailer=require('nodemailer');
var xoauth2 = require('xoauth2');
var mailerhbs = require('nodemailer-express-handlebars');

 var maileropts = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'templates/views/layouts/',
         defaultLayout : 'email',
         partialsDir : 'templates/views/partials/',
         helpers: new require('../templates/views/helpers')()
     },
     viewPath: 'templates/views/emails/',
     extName: '.hbs'
 };
 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'ivyleagueownersassociation@gmail.com',
            clientId: '524403321571-05qqcuipsl7ltji6s01aorbjbrg81u64.apps.googleusercontent.com',
            clientSecret: 'FL8HPWGFFoxVsNwUbRfhrZ-8',
            refreshToken:'1/BBNbOjzCGaycMwQ7urgKiBdCmy6SsO3G6UesxMKfbUE'
            
        })
    }
});
transporter.use('compile', mailerhbs(maileropts));
module.exports = transporter;