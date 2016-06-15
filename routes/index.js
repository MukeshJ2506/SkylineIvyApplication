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
    app.get('/keycontacts', routes.views.keycontacts);
    app.get('/events', routes.views.events);
    app.get('/notices', routes.views.notices);
    /*app.get('/blog', routes.views.blog);
    app.get('/blog/post/:post', routes.views.post);
    app.get('/realestate', routes.views.realestate);
    app.get('/gallery', routes.views.gallery);*/
    //Session Routes
    app.all('/memberapplication', routes.views.session.memberapplication);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
    
    //Auth Routes
    // Authentication
/*	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);*/

    // User
	app.all('/me*', middleware.requireUser);
	/*app.all('/me', routes.views.me);
	app.all('/me/create/blog', routes.views.createpost);
    app.get('/me/view/blog', routes.views.viewpost);
    app.get('/me/view/realestate', routes.views.viewpost);
    app.get('/me/view/grievance', routes.views.viewpost);
	app.all('/me/create/realestate', routes.views.createrealestate);
    app.all('/me/create/grievance', routes.views.creategrievance);*/

}
