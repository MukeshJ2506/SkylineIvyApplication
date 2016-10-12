var keystone = require('keystone'),
	async = require('async');
var log  = require('../../helpers/logger.js');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'enquiry';
	locals.formData = req.body || {};
    locals.enquiryTypes = [{label:'Quote',value:'Quote'}, {label:'Event',value:'Event'}, {label:'Employment',value:'Employment'},{label:'Real Estate',value:'Real Estate'}];
	view.on('post', { action: 'Contact Association' }, function(next) {
		async.series([
			
			function(cb) {
				
				if (!req.body.firstname || !req.body.lastname || !req.body.phone || !req.body.message || !req.body.enquirytype) {
					req.flash('error', 'Please enter name, email, phone, message and enquiry type.');
					return cb(true);
				}
				
				return cb();
				
			},
			
			
			function(cb) {
			
				var enquiryData = {
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					email: req.body.email,
					phone: req.body.phone,
                    enquiryType:req.body.enquirytype,
                    message:req.body.message,
                    status:'Open'
				};
				
				var Enquiry = keystone.list('Enquiry').model,
					newEnquiry = new Enquiry(enquiryData);
				
				newEnquiry.save(function(err) {
                    if(err){log.error('Error while saving enquiry: '+err);}
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) return next();
			req.flash('success', 'Thank you for registering an enquiry. Please wait for an email or a call to proceed with the same.');
            res.redirect('/');
			
		});
		
	});
	
	view.render('site/enquiry');
	
}
