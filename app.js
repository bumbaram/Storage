
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
  , error = require('./routes/error')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  //, flash = require('connect-flash') // nessesory for passport work
  , mongoose = require('mongoose');

var app = express();

/* 
  Passport authtification
*/

var users = [
  { id: 1, username: "bumbaram", password: "pass", email: "me@lagner.ru"},
  { id: 2, username: "test", password: "test", email: "test@test.com"}
];

passport.serializeUser(function(user, done) {
  console.log("serialize user: ");
  console.dir(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserialize user: ");
  console.dir(id);

  done(null, users[0]);
});

var checkLogin = function(username, password, done) {
  console.log("check login: " + username);
  if (username == "bumbaram" && password == "pass") {
    console.log("auth successfull");
    done(null, users[0]);
  } else {
    console.log("auth failed");
    done(null, false, {message: "wrong user"});
  }
};

var requireAuth = function(req, res, next) {
  console.dir(req.user);
  console.log("isAuthenticated: " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

passport.use(new LocalStrategy(checkLogin));
  


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
  //app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
  
app.configure('development', function(){
  app.use(express.errorHandler());
});



// setup routes
app.get('/', requireAuth, routes.index);
app.get('/file/:id', routes.getFile);
app.get('/users', user.list);
app.get('/account', user.getUser);
app.get('/login', user.login);
app.get('/register', user.register);
app.get('/error', error.notExist);
app.get('/logout', function(req, res) { req.logout(); res.redirect('/login'); });


app.post('/file', routes.addFile);
app.post('/login', 
  passport.authenticate('local', {failureRedirect: '/login', failureFlash: false}),
  function(req, res) {
    res.redirect('/');
});
app.post('/register', user.addUser);

// Connect to database
mongoose.connect("mongodb://localhost/storage");

var db = mongoose.connection;

db.once('open', console.info.bind(console, "Database is connected"));
db.on('error', console.error.bind(console, "Database error"));

// Start web server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
  