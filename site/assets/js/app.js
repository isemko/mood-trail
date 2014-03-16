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
/*
App.ApplicationAdapter = DS.RESTAdapter.extend({
	url : 'http://localhost:5000',
	namespace : 'api',
	serializer : DS.RESTSerializer.extend({
		primaryKey : function(type) {
			conosle.log('prim');
			return '_id';
		},
	   extract: function(loader, json, type, record) {
	   	console.log('ass')
      var newJSON, root;
      root = this.rootForType(type);
      newJSON = {};
      newJSON[root] = json;
      json = newJSON;
      this.sideload(loader, type, json, root);
      this.extractMeta(loader, type, json);
      if (json[root]) {
        if (record) {
          loader.updateId(record, json[root]);
        }
        return this.extractRecordRepresentation(loader, type, json[root]);
      } else {
        return Ember.Logger.warn("Extract requested, but no data given for " + type + ". This may cause weird problems.");
      }
    },
    extractMany: function(loader, json, type, records) {
      var i, newJSON, objects, reference, references, root;
      root = this.rootForType(type);
      root = this.pluralize(root);
      newJSON = {};
      newJSON[root] = json;
      json = newJSON;
      this.sideload(loader, type, json, root);
      this.extractMeta(loader, type, json);
      if (json[root]) {
        objects = json[root];
        references = [];
        if (records) {
          records = records.toArray();
        }
        i = 0;
        while (i < objects.length) {
          if (records) {
            loader.updateId(records[i], objects[i]);
          }
          reference = this.extractRecordRepresentation(loader, type, objects[i]);
          references.push(reference);
          i++;
        }
        return loader.populateArray(references);
      }
    }
   
	})
});
*/
App.Store = DS.Store.extend({
	revision : 13
	//adapter : App.ApplicationAdapter.create()

});

App.ApplicationRoute = Ember.Route.extend({
	setupController : function(controller, model) {
		
		this._super(controller, model);
		this.get('store').findAll('mood');
	}
});
App.Router.map(function() {

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

});
App.IndexController = Ember.ArrayController.extend({
	moodCount : Ember.computed.alias('length')

});

