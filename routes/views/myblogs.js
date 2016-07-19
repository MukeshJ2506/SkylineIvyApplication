var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
    locals.data = {
		posts: [],
		 pagination:{}
	};
	
	
	view.on('init', function(next) {
        var q = keystone.list('Blogs').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
            .where('author', req.user)
			.sort('-publishedDate');
				
		q.exec(function(err, results) {
			locals.data.posts = results.results;
            delete results.results;
            locals.data.pagination = results;
			next(err);
		});
	
	});
	
	view.render('site/blog');
	
}
