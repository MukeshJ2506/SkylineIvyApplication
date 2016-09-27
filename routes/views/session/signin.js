var keystone = require('keystone'),
	async = require('async');
var log  = require('../../../helpers/logger');

exports = module.exports = function(req, res) {
    
	if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	locals.form = req.body;
	
	view.on('post', { action: 'signin' }, function(next) {
        
        if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
        
       keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

					if (err||!user) {
						req.flash('error', 'User is not registered, please apply for membership.');
						return next();
					}
                    if(!user.isVerified){
                        req.flash('error', 'User already exists with that email address. If you are awaiting for acceptance from admin, please wait for the same.');
						return next();
                    }else {
                         keystone.session.signin({ email: req.body.email, password: req.body.password,verified: false }, req, res, onSuccess, onFail);
                    }
					
        });
				
		
		var onSuccess = function(user) {
            if(user.isVerified){
                if (req.body.target && !/join|signin/.test(req.body.target)) {
                    log.info('[signin] - Set target as [' + req.body.target + '].');
                    res.redirect(req.body.target);
                } else {
                    log.info("Successful login");
                    res.redirect('/');
                }
            }else{
                 res.redirect('/signout');
                                
            }
		}
		
		var onFail = function() {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		}
	});
	
	view.render('session/signin');
	
}
