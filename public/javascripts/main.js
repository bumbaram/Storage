"use strict";

var File = Backbone.Model.extend({
	defaults: {
		_id: "123",
		name: "Noname",
		description: "No description"
	},

	validate: function(attrs) {
		console.log("validate obj " + this.name);
	}
});

var FileCollection = Backbone.Collection.extend({

	model: File,

	url: "/files",

	initialize: function() {
	}
});

var FileView = Backbone.View.extend({

	model: File, 

	tagName: "tr", 

	className: "file-row",

	initialize: function() {
	},

	render: function() {
		var template = _.template($("#item-template").html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	}
});

var AppView = Backbone.View.extend({

	tagName: "tbody",
	id: "files-table",

	initialize: function() {
		var models = document.getElementById('data').innerText;
		list.reset(JSON.parse(models));
		this.render().addAll();
	},

	render: function() {
		$("#files").append(this.el);
		return this;
	},

	addFile: function(file) {
		var fileView = new FileView({ model: file });
		this.$el.append(fileView.render().el);
	},

	addAll: function() {
		list.each(this.addFile, this);
	}
});

var list, app;

$(function() {
	list = new FileCollection;
	app = new AppView;
});
