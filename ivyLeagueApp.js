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
  'view cache': false,     
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
            user: 'Ivyleagueownersassociation@gmail.com',
            clientId: ' 524403321571-c6hi41bvr5pq09t79lqcmh676k8stbn7.apps.googleusercontent.com ',
            clientSecret: ' WToiJiETsz0p9OfSiUvuXg58',
            refreshToken:'1/IRdV0KgGYyF3L2iJxB7dnt6Ze4jGPE_Kmbaxfcb5RAs',
            accessToken:'ya29.Ci_7AgHVVav4IQf1fk_l0vB2eET9Vv_Z8sJhI7yRoLxQ-mkKhU8TGyou-m0x0mt4yw'
            
        })
    }
});*/

 
keystone.start();