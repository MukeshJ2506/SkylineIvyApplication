var keystone = require('keystone');
var _ = require('lodash');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		events: [],
        pagination:{}
	};
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'events';
    
    //Fetches the contact list
    
    view.on('init', function(next) {
		
		var q = keystone.list('Events').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
            }).where('eventType').in(['General', 'Owners Only']).where('state').in(['Scheduled', 'Active']);
       
		
		q.exec(function(err, results) {
			locals.data.events = results.results;
            locals.data.pagination = _.omit(results, ['results']);
			next(err);
		});
		
	});
    
    view.render('site/events');
    
}