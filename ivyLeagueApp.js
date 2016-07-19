var keystone = require('keystone');
var handlebars = require('express-handlebars');
//require('keystone-nodemailer');
//var xoauth2 = require('xoauth2');
//var nodemailer=require('nodemailer');
//var transporter = nodemailer.createTransport('smtps://mukesh.jayaram%40gmail.com:pass@smtp.gmail.com');

keystone.init({

  'name': 'Skyline Ivy League',
  
  'favicon': 'public/favicon.ico',
  'less': 'public',
  'static': ['public','upload'],
  
  'views': 'templates/views',
  'view cache': true,     
  'view engine': 'hbs',
  'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
  }).engine,
  'emails': 'templates/emails',    
  
  'auto update': true,
  'mongo': process.env.MONGO_URI || 'mongodb://localhost/skyline-ivy-league-app',
  
  'session': true,
  'session store': 'mongo',
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'skylineivyleague',
    
  'basedir': __dirname
  
});
 
require('./models');
 
keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'Users': 'users',
    'Events': 'events',
    'Notices': 'notices',
    'Minutes': 'minutes',
    'Blogs': 'blogs',
    'Enquiry': 'Enquiry',
    'Real Estate':'Realestate',
    'Key Contacts':'keycontacts',
    'Gallery':'Gallery',
    'Service Requests':'Services'
});

/*keystone.set('nav', {
	'blogs': ['posts', 'post-categories', 'post-comments'],
	'galleries': 'galleries',
	'applications': 'applications',
	'realestate': 'realestate',
    'events': ['events','event-categories'],
    'members': ['users', 'type']
});*/

/*keystone.set('email nodemailer', {
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
                       user: 'ivyleagueownersassociation@gmail.com',
            clientId: '524403321571-05qqcuipsl7ltji6s01aorbjbrg81u64.apps.googleusercontent.com',
            clientSecret: 'FL8HPWGFFoxVsNwUbRfhrZ-8',
            refreshToken:'1/BBNbOjzCGaycMwQ7urgKiBdCmy6SsO3G6UesxMKfbUE'
            
        })
    }
});*/

 
keystone.start();