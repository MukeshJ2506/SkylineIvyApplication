var keystone = require('keystone'),
	async = require('async');
var log  = require('../../../helpers/logger');

exports = module.exports = function(req, res) {

	if (!req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.form = req.body;
	
	view.on('post', { action: 'changepwd' }, function(next) {
        
        if (!req.body.oldpwd || !req.body.password || !req.body.confirmpwd) {
			req.flash('error', 'Please enter your old and new passwords.');
			return next();
		}else if (req.body.password != req.body.confirmpwd) {
            req.flash('error', 'Passwords entered do not match.');
			return next();
		}
        req.user._.password.compare(req.body.oldpwd, function(err, isMatch) {
                    if (!err && isMatch) {
                        keystone.list('User').model.findOne({ email: req.user.email}, function(findError, user) {
                          if (findError) {
                            // handle error
                            log.error(findError);
                            req.flash('error', 'Oops! Something went wrong.');
                          } else {
                            user.password = req.body.password;
                            user.save(function(saveError) {
                              if (saveError) {
                                log.error(saveError);
                                req.flash('error', 'Oops! Something went wrong.');
                              }
                            req.flash('success', 'Your password has been changed.');
                            res.redirect("/");
                            });
                          }
                        });
                    }
                    else {
                        req.flash('error', 'Entered old password is not correct, please re-enter the same.');
                        return next();
                    }
        });
           
	});
	
	view.render('session/changepwd');
	
}
