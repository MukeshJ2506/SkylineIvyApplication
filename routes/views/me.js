var keystone = require('keystone');
var log  = require('../../helpers/logger');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
    locals.profile = {};
	
	view.on('post', { action: 'Update Profile' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'mobileNo, presentAddress',
			flashErrors: true
		}, function(err) {
		
			if (err) {
                log.error('Error while updating my profile: ' + err);
                req.flash('error', 'Oops! Something went wrong.');
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
            res.redirect("/me");
		
		});
	
	});
	
	view.on('init', function(next) {
        var userBuf = req.user;
        locals.profile.firstName = userBuf.name.first;
        locals.profile.lastName = userBuf.name.last; 
        locals.profile.email = userBuf.email; 
        locals.profile.apartmentNo = userBuf.apartmentNo; 
        locals.profile.towerName = userBuf.towerName; 
        locals.profile.mobileNo = userBuf.mobileNo; 
        locals.profile.stayType = userBuf.stayType; 
        if(userBuf.presentAddress!=undefined){
            locals.profile.presentAddress = userBuf.presentAddress;
        }else{
            locals.profile.presentAddress = "";   
        }
        return next();
	
	});
	
	view.render('site/me');
	
}
