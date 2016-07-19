var keystone = require('keystone');
var Types = keystone.Field.Types;

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
    state: { type: Types.Select, options: 'Open, In Progress, Resolved, Closed', default: 'Open', index: true }
});


/**
 * Registration
 * ============
 */

Services.register();