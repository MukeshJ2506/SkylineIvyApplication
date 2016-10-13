var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	
	keystone.session.signout(req, res, function() {
        req.flash('success', 'You have signed out successfully. Please sign-in again, from sign-in page.');
		res.redirect('/');
	});
	
};
