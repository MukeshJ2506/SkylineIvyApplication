var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

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