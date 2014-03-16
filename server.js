// Module dependencies.

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/moods';

var application_root = __dirname, express = require('express'), //Web framework
path = require('path'), //Utilities for dealing with file paths

mongoose = require('mongoose');
//MongoDB integration

//Create server
var app = express();

// Configure server
app.configure(function() {
	//parses request body and populates request.body
	app.use(express.bodyParser());

	//checks request.body for HTTP method overrides
	app.use(express.methodOverride());

	//perform route lookup based on url and HTTP method
	app.use(app.router);

	//Where to serve static content
	app.use(express.static(path.join(application_root, 'site')));

	//Show all errors in development
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});
mongoose.connect(mongoUri);

//Schemas

var mood = new mongoose.Schema({

	title : String

});

var moodModel = mongoose.model('mood', mood);
app.get('/api/moods', function(request, response) {
	return moodModel.find(function(err, moods) {
		if (!err) {
			//format JSON with root element
			var Mood = {
				mood : moods
			};
			return response.send(Mood);


		} else {
			return console.log(err);
		}
	});
});
app.post('/api/moods', function(request, response) {
	var mood = new moodModel({
		title : request.body.title

	});
	mood.save(function(err) {
		if (!err) {
			return console.log('created mood');
		} else {
			return console.log(err);
		}
	});
	return response.send(mood);
});
app.get('/api/moods/:id', function(request, response) {
	return moodModel.findById(request.params.id, function(err, mood) {
		if (!err) {
			return response.send(mood);
		} else {
			return console.log(err);
		}
	});
});
app.put('/api/moods/:id', function(request, response) {
	console.log('Updating mood ' + request.body.title);
	return moodModel.findById(request.params.id, function(err, mood) {

		mood.title = request.body.title, console.log(mood)
		return mood.save(function(err) {
			if (!err) {
				//console.log('mood updated asdass');
			} else {
				console.log(err);
			}
			return response.send(mood);
		});
	});
});
app.delete ('/api/moods/:id',
function(request, response) {
	console.log('removing mood with id: ' + request.params.id);
	return moodModel.findById(request.params.id, function(err, mood) {
		return mood.remove(function(err) {
			if (!err) {
				console.log('mood removed');
				return response.send('');
			} else {
				console.log(err);
			}
		});
	});
});

//Start server
var port = 5000;
app.listen(process.env.PORT || 5000, function() {
	console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
