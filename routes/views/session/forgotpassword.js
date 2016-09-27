var keystone = require('keystone'),
	User = keystone.list('User');
var log  = require('../../../helpers/logger');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.on('post', { action: 'forgot-password' }, function(next) {
		
		if (!req.body.email) {
			req.flash('error', "Please enter an email address.");
			return next();
		}

		User.model.findOne().where('email', req.body.email).exec(function(err, user) {
			if (err) {log.error(err);return next(err);}
			if (!user) {
				req.flash('error', "Sorry, we don't recognise that email address.");
				return next();
			}
			user.resetPassword(function(err) {
				if (err) {
					log.error('===== ERROR sending reset password email =====');
					log.error(err);
					req.flash('error', 'Error sending reset password email.');
					next();
				} else {
					req.flash('success', 'We have emailed you a link to reset your password');
					res.redirect('/');
				}
			});
		});
		
	});
	
	view.render('session/forgotpassword');
	
}
