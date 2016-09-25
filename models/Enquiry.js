var keystone = require('keystone');
var Types = keystone.Field.Types;
var transporter = require('../helpers/emailBot');

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
    track:true,
    autokey: { path: 'key', from: 'email', unique: true }
});

Enquiry.add({
	name: { type: Types.Name, required: true,initial:true },
	email: { type: Types.Email, required: true,initial:true },
	phone: { type: Number, required:true,intial:true },
	enquiryType: { type: Types.Select, options:'Quote, Event, Employment, Real Estate' },
	message: {  type: Types.Html, wysiwyg: true, height: 400, required: true, initial:true },
	createdAt: { type: Date, default: Date.now },
    status:{type:Types.Select, options:'Open,Closed', default:'Open'}
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
    
	
	keystone.list('User').model.find({}, {email:1,name:1,_id:0}).where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
        
        var emailStr = "";
        admins.forEach(function(item,index){
            emailStr += item.email+",";
        })
       // var mailBody = '<strong>Hi,</strong><h4 class="text-larger">An enquiry was just submitted to:</h4><p class="text-larger">From: <strong>'+enquiry.name.first+' '+enquiry.name.last+'</strong><br/>(<a href="mailto:'+enquiry.email+'">'+enquiry.email+'</a>)</p><h4 class="text-larger">Phone: '+enquiry.phone+'</h4><h3 class="text-larger">'+enquiry.enquiryType+'</h3><h3>'+enquiry.message+'</h3><p class="text-muted">Sent: '+enquiry.createdAt+'</p>';
        enquiry.domain = 'http://localhost:3000';
		
		var mailOptions = {
            from: '"skyline ivyleague👥" <ivyleagueownersassociation@gmail.com>', // sender address 
            to: emailStr, // list of receivers 
            subject: 'Notification for an enquiry', // Subject line 
            template: 'enquiry-notification',
            context: enquiry
        };
 
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
	});
};

Enquiry.register();