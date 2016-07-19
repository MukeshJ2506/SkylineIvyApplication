var keystone = require('keystone'),
    async = require('async'),
    crypto = require('crypto'),
    Types = keystone.Field.Types;
 
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

User.register();