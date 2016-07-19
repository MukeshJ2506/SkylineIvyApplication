var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);
 
// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
 
// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});
 
// Handle other errors
keystone.set('500', function(err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});
 
// Load Routes
var routes = {
    views: importRoutes('./views')
};
 
// Bind Routes
exports = module.exports = function(app) {
   
    //Site Routes
    app.get('/', routes.views.index);
    app.all('/enquiry', routes.views.enquiry);
    app.get('/keycontacts',middleware.requireUser, routes.views.keycontacts);
    app.get('/events', middleware.requireUser, routes.views.events);
    app.get('/notices', middleware.requireUser, routes.views.notices);
    app.get('/minutes', middleware.requireUser, routes.views.minutes);
    app.get('/blog', middleware.requireUser, routes.views.blog);
    app.get('/blog/post/:post', middleware.requireUser, routes.views.post);
    app.all('/blog/create',middleware.requireUser,  routes.views.createpost);
    app.get('/realestate', routes.views.realestate);
    app.all('/realestate/create',middleware.requireUser, routes.views.createrealestate);
    app.all('/createrequest', routes.views.createrequest);
    app.all('/deleterequest/:request', middleware.requireUser, routes.views.deleterequest);
    app.all('/deleterealestate/:request', middleware.requireUser, routes.views.deleterealestate);
    app.get('/gallery',middleware.requireUser, routes.views.gallery);
    //Session Routes
    app.all('/memberapplication', routes.views.session.memberapplication);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
  //  app.all('/forgot-password', routes.views.session['forgot-password']);
//	app.all('/reset-password/:key', routes.views.session['reset-password']);
    
    //Auth Routes
    // Authentication
/*	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);*/

    // User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
    app.get('/me/myblogs', routes.views.myblogs);
    app.get('/me/myrealestate', routes.views.myrealestate);
    app.get('/me/myrequests', routes.views.myrequests);
    app.all('/me/changepassword', routes.views.session.changepassword);

}