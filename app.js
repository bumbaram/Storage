
/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , fs = require('fs');


// load mongoose models;
var MODELS_DIR = __dirname + "/models/";

fs.readdirSync(MODELS_DIR).forEach(function(file) { 
  require(MODELS_DIR + file);
});

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('models', __dirname + '/models');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('very secret Service'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
  
app.configure('development', function(){
  app.use(express.errorHandler());
});

// setup routes
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/file/:id', routes.getFile);

app.post('/file', routes.addFile);


// Connect to database
mongoose.connect("mongodb://localhost/storage");

var db = mongoose.connection;

db.once('open', console.info.bind(console, "Database is connected"));
db.on('error', console.error.bind(console, "Database error"));

// Start web server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
  