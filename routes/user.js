
/*
 * GET users listing.
 */

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
	console.dir(req.body);
	res.end("Registered");
};