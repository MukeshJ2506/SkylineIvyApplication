var keystone = require('keystone');
var Types = keystone.Field.Types;
var transporter = require('../helpers/emailbot');
var log  = require('../helpers/logger');

/**
 * Minutes Model
 * =============
 */

var Minutes = new keystone.List('Minutes', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Minutes.add({
	name: { type: String, required: true, index: true, initial: true },
	meetingDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2016-07-15 / 6:00pm' },
	notes: { type: Types.Html, wysiwyg: true, required:true, initial:true }
});

// Pre Save
// ------------------------------

Minutes.schema.pre('save', function(next) {
	var minutes= this;
    minutes.domain = keystone.get('domain');
    if(minutes.isNew){
        keystone.list('User').model.find({}, {email:1,name:1,_id:0}).where('stayType', 'Owner').exec(function(err, users) {
		
            if (err){log.error("Error inside Minutes while accessing User: "+err); return callback(err);}
             var emailStr = "";
            users.forEach(function(item,index){
                emailStr += item.email+",";
            })
             var mailOptions = {
                from: '"skyline ivyleague👥" <ivyleagueownersassociation@gmail.com>', // sender address 
                bcc: emailStr, // list of receivers 
                subject: 'Minutes of meeting from SILOA for your attention', // Subject line 
                template: 'minutes-notification',
                context: minutes
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                     log.error("From Minutes: "+error);
                    return error;
                }
                console.log('Message sent from Minutes: ' + info.response);
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

Minutes.register();