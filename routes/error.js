
exports.notExist = function(req, res) {
	res.render('error', { title: "File not found",
		text: "Not found" });
};