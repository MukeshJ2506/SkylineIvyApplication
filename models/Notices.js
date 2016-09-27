var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;
var transporter = require('../helpers/emailBot');
var log  = require('../helpers/logger');


/**
 * Notices Model
 * =============
 */

var Notices = new keystone.List('Notices', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Notices.add({
	name: { type: String, required: true, index: true, initial: true },
    state: { type: Types.Select, options: 'Scheduled, Active, Past', noedit: true },
	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2016-07-15 / 6:00pm' },
	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2016-07-15 / 9:00pm' },
	description: { type: Types.Html, wysiwyg: true, required:true, initial:true }
});

// Pre Save
// ------------------------------

Notices.schema.pre('save', function(next) {
	var notice= this;
    notice.domain = keystone.get('domain');
    if(notice.isNew){
        keystone.list('User').model.find({}, {email:1,name:1,_id:0}).exec(function(err, users) {
		
            if (err){log.error("Error inside Notices while accessing User: "+err); return callback(err);}
             var emailStr = "";
            users.forEach(function(item,index){
                emailStr += item.email+",";
            })
             var mailOptions = {
                from: '"skyline ivyleague👥" <ivyleagueownersassociation@gmail.com>', // sender address 
                bcc: emailStr, // list of receivers 
                subject: 'Notice from SILOA for your attention', // Subject line 
                template: 'notice-notification',
                context: notice
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    log.error("From Notices: "+error);
                    return error;
                }
                log.info('Message sent from Notices: ' + info.response);
                return true;
            });
        });
    }
	
	if (moment().isAfter(moment(notice.endDate))) {
		notice.state = 'Past';
    }else if ((moment().isSameOrAfter(notice.startDate))&&(moment().isSameOrBefore(notice.endDate))) {
		notice.state = 'Active';
	}else if (moment().isSameOrBefore(moment(notice.startDate))) {
		notice.state = 'Scheduled';
	}
	next();
});

/**
 * Registration
 * ============
 */

Notices.register();