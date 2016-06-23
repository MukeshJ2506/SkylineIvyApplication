var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
    locals.profile = {};
	/*locals.page.title = 'Settings - SydJS';
	
	view.query('nextMeetup',
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('startDate')
	, 'talks[who]');
	
	view.query('rsvps.history',
		RSVP.model.find()
			.where('who', req.user)
			.where('attending', true)
			.populate('meetup')
			.sort('-createdAt')
	);*/
	
	view.on('post', { action: 'Update Profile' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'mobileNo, presentAddress',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			//return next();
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
