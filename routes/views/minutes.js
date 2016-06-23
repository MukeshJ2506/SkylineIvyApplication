var keystone = require('keystone');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		minutes: [],
        pagination:{}
	};
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'minutes';
    
    //Fetches the contact list
    
    view.on('init', function(next) {
		
		var q = keystone.list('Minutes').paginate({
                page: req.query.page || 1,
                perPage: 2,
                maxPages: 10
            });
       
		
		q.exec(function(err, results) {
			locals.data.minutes = results.results;
            delete results.results;
            locals.data.pagination = results;
			next(err);
		});
		
	});
    
    view.render('site/minutes');
    
}