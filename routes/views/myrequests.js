var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var log  = require('../../helpers/logger');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
    locals.data = {
		requests: [],
		 pagination:{}
	};
	
	
	view.on('init', function(next) {
        var q = keystone.list('Services').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
            .where('requestor', req.user)
			.sort('-requestDate');
				
		q.exec(function(err, results) {
			locals.data.requests = results.results;
            delete results.results;
            locals.data.pagination = results;
            if(err){log.error(err);}
			next(err);
		});
	
	});
	
	view.render('site/myrequests');
	
}
