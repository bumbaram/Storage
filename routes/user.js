
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