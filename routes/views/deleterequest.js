var keystone = require('keystone');
var log  = require('../../helpers/logger');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.doubleRoot = true;
	
	// Set locals
	locals.section = 'me';
	locals.filters = {
		request: req.params.request   
	};
        
		var q = keystone.list('Services').model.findOne({
            'state':'Open',
            '_id':locals.filters.request,
            'requestor':req.user
			
		});
		
		q.exec(function(err, result) {
            if(err){log.error('Error while removing a service request: '+err);}
			result.state = "Closed";
            result.save();
            req.flash('success', 'You have successfully closed the request.');
            res.redirect("/me/myrequests");
		});
};
