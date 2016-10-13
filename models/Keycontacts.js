var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Keycontacts = new keystone.List('Keycontacts', {
    track:true,
	autokey: { path: 'key', from: 'contactNo', unique: true }
});

Keycontacts.add({
	contactName: { type: Types.Name, ref: 'User', index: true },
    contactNo:{type:Types.Number, required:true,initial:true },
    description: { type: Types.Html, wysiwyg: true, height: 250 }
});
Keycontacts.defaultColumns = 'contactName';
Keycontacts.register();