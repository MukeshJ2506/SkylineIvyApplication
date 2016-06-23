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
	autokey: { path: 'slug', from: 'title author', unique: true }
});

Blogs.add({
	title: { type: String, required: true, initial:true, noedit:true,unique:true},
	state: { type: Types.Select, options: 'Draft, Published, Archived', default: 'Draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true, noedit:true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'Published' } },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150, noedit:true },
		extended: { type: Types.Html, wysiwyg: true, height: 400, noedit:true }
	}
});
//Blogs.index({ title: 1, author: -1 }); // schema level
Blogs.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


Blogs.register();