var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.doubleRoot = true;
	// Set locals
	locals.section = 'me';
	locals.filters = {
		request: req.params.request   
	};
        
		var q = keystone.list('Realestate').model.findOne({
            'status':'Open',
            '_id':locals.filters.request,
            'advertisor':req.user
			
		});
		
		q.exec(function(err, result) {
			result.status = "Closed";
            result.save();
            req.flash('success', 'You have successfully closed the advert.');
            res.redirect("/me/myrealestate");
		});	
};
