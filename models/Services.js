var keystone = require('keystone');
var Types = keystone.Field.Types;
var transporter = require('../helpers/emailBot');

/**
 * Services Model
 * =============
 */

var Services = new keystone.List('Services', {
	track: true,
    nocreate:true,
	autokey: { path: 'key', from: 'requestor requestDate', unique: true }
});

Services.add({
	requestor: { type: Types.Relationship, ref: 'User', index: true, noedit:true },
    requestType: { type: Types.Select, options: 'Service, Grievance, Suggestion', noedit: true },
	requestDate: { type: Types.Date, index: true, default:Date.now, noedit:true },
	description: { type: Types.Html, wysiwyg: true, required:true, initial:true, noedit:true },
    state: { type: Types.Select, options: 'Open, In Progress, Resolved, Closed', default: 'Open', index: true },
    comments: { type: Types.Html, wysiwyg: true,  initial:true}
});

// Pre Save
// ------------------------------

Services.schema.pre('save', function(next) {
	var service= this;
    console.log(service)
    service.domain = keystone.get('domain');
    if(service.isNew){
           keystone.list('User').model.findOne().where('_id', service.requestor).exec(function(err, user) {
            if(err){return false;}
            service.name = user.name
             var mailOptions = {
                from: '"skyline ivyleague👥" <ivyleagueownersassociation@gmail.com>', // sender address 
                to: 'ivyleagueownersassociation@gmail.com', // list of receivers 
                subject: 'Service request logged at Skyline Ivy League', // Subject line 
                template: 'service-notification',
                context: service
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    return error;
                }
                console.log('Message sent: ' + info.response);
                return true;
            });
    });
    }
	
	next();
});
/**
 * Registration
 * ============
 */

Services.register();