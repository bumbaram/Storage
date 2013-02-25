
exports.notExist = function(req, res) {
	res.render('error404', { title: "File not found" });
};