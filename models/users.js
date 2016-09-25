var keystone = require('keystone'),
    async = require('async'),
    crypto = require('crypto'),
    Types = keystone.Field.Types;
var transporter = require('../helpers/emailBot');
 
var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'key', from: 'email', unique: true }
});
 
User.add({
    name: { type: Types.Name, required: true, index: true, noedit:true },
    email: { type: Types.Email, initial: true, required: true, index: true,noedit:true },
    password: { type: Types.Password, initial: true, noedit:true },
    userRole: { type: Types.Select, options:'Admin, Guest, User', required: true, initial: true },
    apartmentNo: {type: String, required: true, initial: true},
    towerName: {type: Types.Select, options:'Columbia, Cornell, Harvard, Princeton, Sylvania, Yale', required: true, initial: true},
    resetPasswordKey: { type: String, hidden: true }
}, 'Profile', {
	mobileNo: { type: Number},
	isAssociation: {type:Boolean},
    stayType: {type: Types.Select, options:'Owner, Rental'},
    presentAddress:{type: String},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can Admin IvyLeague Website' },
	isVerified: { type: Boolean, label: 'Is a verified Owner/Resident' }
});

/**
 * Relationships
 */

User.relationship({ ref: 'Blogs', path: 'blogs', refPath: 'author' });
User.relationship({ ref: 'Realestate', path: 'realestate', refPath: 'advertisor' });
User.relationship({ ref: 'Services', path: 'services', refPath: 'requestor' });

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

/**
 * Methods
 * =======
*/

User.schema.pre('save', function(next) {
    console.log(this.isModified('isVerified'))
	 if (this.isModified('isVerified') && this.isVerified ) {
        console.log('test')
    }
    next();
});

User.schema.methods.resetPassword = function(callback) {
    if ('function' !== typeof callback) {
		callback = function() {};
	}
	var user = this;
	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	user.save(function(err) {
		if (err) return callback(err);
		    var reset={
            domain : 'http://localhost:3000',
            link :  '/resetpassword/' + user.resetPasswordKey,
            user : user.name
        }
        var mailOptions = {
            from: '"skyline ivyleague👥" <ivyleagueownersassociation@gmail.com>', // sender address 
            to: user.email, // list of receivers 
            subject: 'Reset your IvyLeague Password', // Subject line 
            template: 'password-reset',
            context: reset
        };
 
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                return callback(error);
            }
            console.log('Message sent: ' + info.response);
            return callback();;
        });
	});
}


User.register();