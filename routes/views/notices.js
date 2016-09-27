var keystone = require('keystone');
var log  = require('../../helpers/logger');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		notices: [],
        pagination:{}
	};
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'notices';
    
    //Fetches the contact list
    
    view.on('init', function(next) {
		
		var q = keystone.list('Notices').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
            }).where('state').in(['Scheduled', 'Active']);
       
		
		q.exec(function(err, results) {
			locals.data.notices = results.results;
            delete results.results;
            locals.data.pagination = results;
            if(err){log.error(err);}
			next(err);
		});
		
	});
    
    view.render('site/notices');
    
}