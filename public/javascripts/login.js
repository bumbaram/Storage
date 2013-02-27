"use strict";

$(function() {

	var Workspace = Backbone.Router.extend({

		initialize: function() {
		},

		routes: {
			"" : "login",
			"login" : "login",
			"register": "register"
		}, 

		login: function() {
			this.hide();
			$("#login").show();
		},

		register: function() {
			this.hide();
			$("#register").show();
		},

		hide: function() {
			$("#login").hide();
			$("#register").hide();
		}
	})

	new Workspace();
	Backbone.history.start();
});