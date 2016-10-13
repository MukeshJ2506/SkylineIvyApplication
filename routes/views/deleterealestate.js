var keystone = require('keystone');
var log  = require('../../helpers/logger.js');

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
            if(err){log.error('Error while deleting an advert'+err);}
			result.status = "Closed";
            result.save();
            req.flash('success', 'You have successfully closed the advert.');
            res.redirect("/me/myrealestate");
		});	
};
