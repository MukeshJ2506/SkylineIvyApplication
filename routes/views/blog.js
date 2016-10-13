var keystone = require('keystone');
var log  = require('../../helpers/logger.js');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		 pagination:{}
	};
	
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Blogs').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
            .where('state', 'Published')
			.sort('-publishedDate')
			.populate('author');
				
		q.exec(function(err, results) {
			locals.data.posts = results.results;
            delete results.results;
            locals.data.pagination = results;
            if(err){log.error('Error while fetching data'+err);}
			next(err);
		});
		
	});
	
	// Render the view
	view.render('site/blog');
	
};
