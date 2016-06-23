var keystone = require('keystone');
var Types = keystone.Field.Types;

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

/**
 * Registration
 * ============
 */

Minutes.register();