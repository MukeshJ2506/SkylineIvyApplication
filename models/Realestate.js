var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Realestate = new keystone.List('Realestate', {
    track:true,
    nocreate:true,
    noedit:true,
	autokey: { path: 'key', from: 'advertisor', unique: true }
});

Realestate.add({
	adType: { type: Types.Select, options: 'Rent, Sale, Lease', default: 'Rent', index: true },
	advertisor: { type: Types.Relationship, ref: 'User', index: true },
	createdDate: { type: Types.Date, index: true, default:Date.now },
    description: {type: Types.Html, wysiwyg: true, height: 150 },
    shareDetails: {type:Boolean}
});

Realestate.register();