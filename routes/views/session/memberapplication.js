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
	
	view.on('post', { action: 'Register' }, function(next) {
		async.series([
			
			function(cb) {
				
				if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.towerName || !req.body.apartmentNo) {
					req.flash('error', 'Please enter a name, email, password, tower name and apartment number.');
					return cb(true);
				}else if(req.body.password!=req.body.confirmpassword){
                    req.flash('error', 'Passwords entered do not match.');
					return cb(true);
                }
				
				return cb();
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that email address. If you are awaiting for acceptance from admin, please wait for the same.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
            function(cb) {
				
				keystone.list('User').model.findOne({ towerName: req.body.towerName, apartmentNo: req.body.apartmentNo, stayType: req.body.stayType }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with the same apartment and stay type. If you are awaiting for acceptance from admin, please wait for the same.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
			
				var userData = {
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					email: req.body.email,
					password: req.body.password,
					isVerified:false,
                    apartmentNo:req.body.apartmentNo,
                    towerName:req.body.towerName,
                    isAdmin:false,
                    userRole:'Guest',
                    isAssociation:false,
                    stayType:req.body.stayType,
                    mobileNo:req.body.mobileNo,
                    presentAddress:req.body.presentAddress
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);
				
				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err){log.error(err); return next();}
			req.flash('success', 'Registration is successful. Please wait until Admin accepts your registration.');
            res.redirect('/');
			
		});
		
	});
	
	view.render('session/memberapplication');
	
}
