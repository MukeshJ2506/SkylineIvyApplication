var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Realestate = new keystone.List('Realestate', {
    track:true,
    nocreate:true,
	autokey: { path: 'key', from: 'advertisor', unique: true }
});

Realestate.add({
	adType: { type: Types.Select, options: 'Rent, Sale, Lease', default: 'Rent', index: true, noedit:true},
    status: { type: Types.Select, options: 'Open, Closed', default:'Open' },
	advertisor: { type: Types.Relationship, ref: 'User', index: true, noedit:true },
	createdDate: { type: Types.Date, index: true, default:Date.now, noedit:true },
    description: {type: Types.Html, wysiwyg: true, height: 150, noedit:true },
    heading: {type: Types.Text, noedit:true },
    approvedFlag: {type:Boolean,default:false},
    images: {
        type: Types.LocalFile,
        dest: './upload/realestate/',
        prefix: '/realestate',
        noedit:true,
        allowedTypes: [
            'image/jpeg', 'image/png'
        ],
        filename: function(item, file){
            console.log(item.files);
            return item.id + '.' + file.extension
        },
        format: function(item, file){
            console.log(file.originalname)
            return '<img src="' + file.href + '" style="max-width: 300px">'
        }
    }
});

Realestate.schema.post('remove', function(doc) {
    fs.unlinkSync(doc.images.path+'\\'+ doc.images.filename);
});

Realestate.register();