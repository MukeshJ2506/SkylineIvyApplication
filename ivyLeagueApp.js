var keystone = require('keystone');
var handlebars = require('express-handlebars');
var fs = require('fs');
var path = require('path');
var FileStreamRotator = require('file-stream-rotator');

var logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'DDMMYYYY',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});

var logFilter = function(req, res) {
  return res.statusCode < 400
};


keystone.init({

  'name': 'Skyline Ivy League',
  'env' : process.env.NODE_ENV || "development",
  'port' : process.env.PORT || 3000,
  'compress': true,
  'logger' : 'combined',
  'logger options': {
    stream: accessLogStream
  },
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
keystone.set('domain', process.env.APP_URI || 'http://localhost:3000');

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
 
keystone.start();