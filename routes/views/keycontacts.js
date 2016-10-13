var keystone = require('keystone');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		keycontacts: [],
        pagination:{}
	};
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'keycontacts';
    
    //Fetches the contact list
    
    view.on('init', function(next) {
		
		var q = keystone.list('Keycontacts').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
            });
       
		
		q.exec(function(err, results) {
			locals.data.keycontacts = results.results;
            delete results.results;
            locals.data.pagination = results;
			next(err);
		});
		
	});
    
    view.render('site/keycontacts');
    
}