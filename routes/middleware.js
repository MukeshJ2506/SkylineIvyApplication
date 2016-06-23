var _ = require('underscore'),
    keystone = require('keystone');
 
/**
    Initialises the standard view locals.
    Include anything that should be initialised before route controllers are executed.
*/
exports.initLocals = function(req, res, next) {
    
    var locals = res.locals;
        
    // Add your own local variables here

    locals.navLinksUser = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Events',		key: 'events',		href: '/events' },
        { label: 'Notices',		key: 'notices',		href: '/notices' },
        { label: 'MOMs',		key: 'minutes',		href: '/minutes' },
		{ label: 'Blogs',		key: 'blog',		href: '/blog' },
        { label: 'Real Estate',		key: 'realestate',		href: '/realestate' },
		{ label: 'Gallery',		key: 'gallery',		href: '/gallery' },
        { label: 'Request Service',		key: 'service',		href: '/createrequest' },
		{ label: 'Key Contacts',		key: 'keycontacts',		href: '/keycontacts' }
	];

    locals.navLinksGuest = [
		{ label: 'Home',		key: 'home',		href: '/' },
        { label: 'Real Estate',		key: 'realestate',		href: '/realestate' },
        { label: 'Contact Association',		key: 'enquiry',		href: '/enquiry' }
	];
    
	locals.user = req.user;
    
    next();
    
};
 
/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {
    
    res.err = function(err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    }
    
    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message
        });
    }
    
    next();
    
};
 
/**
    Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function(req, res, next) {
    
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };
    
    res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
    
    next();
    
};

exports.requireUser = function(req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
}