var mongoose 	= require('mongoose')
	, User 		= mongoose.model('User');

exports.list = function(req, res){
	res.send("respond with a resource");
};

exports.login = function(req, res) {
	res.render('login', {title: 'login form'});
};

exports.auth = function(req, res) {
	console.log("auth");
	res.send(401, "unauthorize");
};

exports.getUser = function(req, res) {
	console.dir(req.user);
	res.end("OK");
};

exports.register = function(req, res) {
	res.render('register', { 
		title: "Please register"
		});
};

exports.addUser = function(req, res) {
	if (!req.body) {
		res.redirect('/error');
		return;
	}

	// check data

	var u = new User(req.body);
	console.dir(u);
	u.save(function(err, user) {
		if (err) {
			// redirect to internal server error page
			res.redirect('/error');
			return;
		}
		// "Success" message should be added
		res.redirect('/login');
	});
};

exports.settings = function(req, res) {
	res.render('settings', {
		title: "User settings",
		user: req.user,
	});
};