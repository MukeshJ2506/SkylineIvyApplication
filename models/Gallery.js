var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	images: {
        type: Types.LocalFile,
        dest: './upload/gallery',
        prefix: '/gallery/',
        allowedTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'
        ],
        filename: function(item, file){
            console.log(item.files);
            return item.id + '.' + file.extension
        },
        format: function(item, file){
            return '<img src="./upload/gallery/'+file.filename+'" style="max-width: 300px"/>'
        }
    },
    caption: {type:String}
});

Gallery.register();
