var keystone = require('keystone'),
	async = require('async'),
    path = require('path'),
    fs = require('fs');

exports = module.exports = function(req, res) {
	if (!req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'service';
	locals.formData = req.body || {};
	view.on('post', { action: 'Submit Request' }, function(next) {
		async.series([
			
			function(cb) {
 				if (!req.body.requestType || !req.body.description ) {
					req.flash('error', 'Please enter request type and description.');
					return cb(true);
				}
				return cb();
				
			},
			
			
			function(cb) {
        
				var postData = {
					requestor: locals.user.id,
					description:req.body.description,
                    requestType:req.body.requestType
				};
				var Post = keystone.list('Services').model,
					newPost = new Post(postData);
				Post.findOne().where('requestor', locals.user.id).where('state', 'Open').exec(function(err, post) {

                    if(post == null){
                        newPost.save(function(err) {
                            console.log(err)
                            return cb(err);
                        });
                    }else{
                        req.flash('error', 'Thank you for trying to post. Looks like you already have an active request, please contact admin.');
                        res.redirect('/createrequest');
                    }
    });
               
			
			}
			
		], function(err){
			if (err) return next();
			req.flash('success', 'Thank you for sending a request. This would be acted upon as soon as possible, kindlt wait for further steps from our end.');
            res.redirect('/createrequest');
			
		});
		
	});
	
	view.render('site/createrequest');
	
}
