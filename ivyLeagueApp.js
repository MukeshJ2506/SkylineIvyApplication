var keystone = require('keystone');
var handlebars = require('express-handlebars');
keystone.init({

  'name': 'Skyline Ivy League',
  
  'favicon': 'public/favicon.ico',
  'less': 'public',
  'static': ['public'],
  
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
  /*'emails': 'templates/emails', */   
  
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


/*keystone.set('nav', {
	'blogs': ['posts', 'post-categories', 'post-comments'],
	'galleries': 'galleries',
	'applications': 'applications',
	'realestate': 'realestate',
    'events': ['events','event-categories'],
    'members': ['users', 'type']
});*/
 
keystone.start();