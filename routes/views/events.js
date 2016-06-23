var keystone = require('keystone');
var moment = require('moment')
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		events: []
	};
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'events';
    
    //Fetches the contact list
    
    view.on('init', function(next) {
		
		var q = keystone.list('Events').model.find().where('eventType').in(['General', 'Owners Only']).where('state').in(['Scheduled', 'Active']);
       
		
		q.exec(function(err, results) {
            for(var i =0;i<results.length;i++){
                formatEventObj(results[i],locals.data.events)
            }
			next(err);
		});
		
	});
    
    view.render('site/events');
    
}

function formatEventObj(element,array) {
    var bufElement = {};
    bufElement.start = moment(element.startDate).format("HH:mm");
    bufElement.end = moment(element.endDate).format("HH:mm");
      bufElement.ranges = [{ start: moment(element.startDate).format(),
        end: moment(element.endDate).format()
    }];
    bufElement.title = element.name;
    switch (element.frequency){
        case "Daily":
            bufElement.dow =  [ 1,2,3,4,5,6,7 ];
            break;
        case "Weekdays":
            bufElement.dow =  [ 1,2,3,4,5 ];
            break;
        case "Weekends":
            bufElement.dow =  [ 6,7 ];
            break;
        case "Weekly":
            bufElement.dow =  [ element.frequencyDetail ];
            break;
        case "Monthly":
            bufElement.dom =  [ element.frequencyDetail ];
            break;
         case "Occasion":
            bufElement.dow =  [ element.frequencyDetail ];
            break;
        default:
            break;
        
    }
    bufElement.description = element.description;
    bufElement.venue = element.venue;
    array.push(bufElement);    
}