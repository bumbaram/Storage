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


exports.addUser = function(req, res) {
	if (!req.body) {
		res.redirect('/error');
		return;
	}

	// to do: add data validation

	var params = {
		$or: [
			{ nickname: req.body.nickname },
			{ email: req.body.email }
		]
	};

	User.find(params).count(function(err, num) {
		if (err) {
			// redirect to internal server error page
			res.redirect('/error');
			return;
		}

		if (num !==  0) {
			res.end("User already exist");
			return;
		}
		var u = new User(req.body);

		u.save(function(err, user) {
			if (err) {
				res.redirect('/error');
				return;
			}
			res.redirect('/login');
		});
	});
};

exports.settings = function(req, res) {
	res.render('settings', {
		title: "User settings",
		user: req.user,
	});
};