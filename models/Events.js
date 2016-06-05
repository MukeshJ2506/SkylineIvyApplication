var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Events Model
 * =============
 */

var Events = new keystone.List('Events', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Events.add({
	name: { type: String, required: true, index: true, initial: true },
	frequency: { type: Types.Select,  options: 'Daily, Weekly, Monthly, Occasion, Weekdays, Weekends', required:true, initial:true},
    eventType: { type: Types.Select,  options: 'Personal, General, Owners Only ', required:true, initial:true},
	state: { type: Types.Select, options: 'Scheduled, Active, Past', noedit: true },
	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm' },
	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm' },
	venue: { type: Types.Select, options: 'Club House, Meet n Greet, Barbeque Area, Other', required: true, initial: true, width: 'medium', default: 'Club House', note: 'Usually Club House/Meet n Greet' },
	description: { type: Types.Html, wysiwyg: true, required:true, initial:true }
});

// Pre Save
// ------------------------------

Events.schema.pre('save', function(next) {
	var event= this;
	
	if (moment().isAfter(moment(event.endDate))) {
		event.state = 'Past';
    }else if ((moment().isSameOrAfter(event.startDate))&&(moment().isSameOrBefore(event.endDate))) {
		event.state = 'Active';
	}else if (moment().isSameOrBefore(moment(event.startDate))) {
		event.state = 'Scheduled';
	}
	next();
});

/**
 * Registration
 * ============
 */

Events.register();