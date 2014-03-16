var App = Ember.Application.create({
	LOG_TRANSITIONS : true
});

App.Mood = DS.Model.extend({
	title : DS.attr('string')
});
App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});
DS.RESTAdapter.reopen({
  namespace: 'api'
});

App.Store = DS.Store.extend({
	revision : 13
});

App.ApplicationRoute = Ember.Route.extend({
	setupController : function(controller, model) {
		
		this._super(controller, model);
		this.get('store').findAll('mood');
	}
});
App.Router.map(function() {
	this.route('index', {path: '/'});
	this.resource('moods', function() {
		this.resource('mood', {
			path : '/:id'
		});

	});
	this.route('create', {
		path : '/create'
	});

});

App.IndexRoute = Ember.Route.extend({

	model : function() {
		return this.get('store').findAll("mood")
	}
});
App.MoodRoute = Ember.Route.extend({

	model : function() {
		return App.Mood.find();
	}
});

App.CreateRoute = Ember.Route.extend({
	model : function() {
		return this.get('store').findAll("mood")
	}
	
});
App.IndexController = Ember.ArrayController.extend({
	moodCount : Ember.computed.alias('length')

});
App.CreateController = Ember.ObjectController.extend({
		title : '',
		actions:{
			createMood: function(){
					var md = this.store.createRecord('mood',{ title :this.get('title')});
					md.save();
			}
		}
});
