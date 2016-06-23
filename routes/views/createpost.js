var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	if (!req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'blogs';
	locals.formData = req.body || {};
	view.on('post', { action: 'Submit Blog' }, function(next) {
		async.series([
			
			function(cb) {
 				if (!req.body.title || !req.body.summary || !req.body.maincontent) {
					req.flash('error', 'Please enter title, summary and main content.');
					return cb(true);
				}
				
				return cb();
				
			},
			
			
			function(cb) {
				var postData = {
					author: locals.user.id,
					title: req.body.title,
					content:{
                        brief: req.body.summary,
                        extended:req.body.maincontent
                    },
                    state:'Draft'
				};
				var Post = keystone.list('Blogs').model,
					newPost = new Post(postData);
				
				newPost.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			if (err) return next();
			req.flash('success', 'Thank you for writing a post. Once admin approves this would be added in Blogs section.');
            res.redirect('/blog');
			
		});
		
	});
	
	view.render('site/createpost');
	
}
