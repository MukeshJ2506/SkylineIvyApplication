var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.doubleRoot = true;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};
	// Load the current post
	view.on('init', function(next) {
        
		var q = keystone.list('Blogs').model.findOne({
			state: 'Published',
			slug: locals.filters.post
		}).populate('author');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('site/post');
	
};
