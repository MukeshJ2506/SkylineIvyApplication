var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Blogs = new keystone.List('Blogs', {
	map: { name: 'title' },
    track:true,
    nocreate:true,
    noedit:true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Blogs.add({
	title: { type: String, required: true, initial:true },
	state: { type: Types.Select, options: 'Draft, Published, Archived', default: 'Draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'Published' } },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	}
});

Blogs.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


Blogs.register();