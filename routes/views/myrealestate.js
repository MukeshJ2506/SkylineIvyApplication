var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
    locals.data = {
		requests: [],
		 pagination:{}
	};
	
	
	view.on('init', function(next) {
        var q = keystone.list('Realestate').paginate({
				page: req.query.page || 1,
				perPage: 3,
				maxPages: 10
			})
            .where('advertisor', req.user)
			.sort('-createdDate');
				
		q.exec(function(err, results) {
			locals.data.requests = results.results;
            delete results.results;
            locals.data.pagination = results;
			next(err);
		});
	
	});
	
	view.render('site/myrealestate');
	
}
