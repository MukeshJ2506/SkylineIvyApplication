var keystone = require('keystone'),
    async = require('async'),
    crypto = require('crypto'),
    Types = keystone.Field.Types;
 
var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'key', from: 'email', unique: true }
});
 
User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, required: true, index: true },
    password: { type: Types.Password, initial: true },
    userRole: { type: String, required: true, initial: true },
    apartmentNo: {type: String, required: true, initial: true},
    towerName: {type: String, required: true, initial: true}
}, 'Profile', {
	mobileNo: { type: String},
	isAssociation: Boolean,
    stayType: {type: String},
    presentAddress:{type: String}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can Admin IvyLeague Website' },
	isVerified: { type: Boolean, label: 'Is a verified Owner/Resident' }
});
 
User.register();