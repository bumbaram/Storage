
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
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

/* 
  Passport authtification
*/
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  var User = mongoose.model('User');
  User.findById(id, function(err, args) {
    if (err) {
      console.log(err);
      done(err);
      return;
    }
    done(err, args);
  });
});

var checkLogin = function(nickname, password, done) {
  var User = mongoose.model('User');

  User.findOne({nickname: nickname}, function(err, args) {
    if (err) {
      console.error(err);
      done(err); 
      return;
    }
    if (!args) {
      console.info("user not found");
      done(null, false, "User not found");
      return;
    }
    if (args.password == password) {
      done(null, args);
    } else {
      console.info("password wrong");
      done(null, false, "Wrong password");
    }
  });
};

var requireAuth = function(req, res, next) {
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
  app.use(express.favicon(__dirname + "/public/favicon.png"));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('very secret Service'));
  app.use(express.session());
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

app.get('/files', requireAuth, routes.getAllFiles);
app.get('/files/:id', requireAuth, routes.getFileById);

app.get('/file/:id', routes.getFile);
app.get('/users', requireAuth, user.list);
app.get('/account', requireAuth, user.getUser);
app.get('/login', user.login);
app.get('/settings', requireAuth, user.settings);
app.get('/error', error.notExist);
app.get('/logout', function(req, res) { req.logout(); res.redirect('/login'); });


app.post('/file', requireAuth, routes.addFile);
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
  