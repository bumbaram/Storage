
/*
 * GET home page.
 */
var fs 		= require('fs');
var util 	= require('util');

var MAX_UPLOAD_SIZE = 1048576 * 10; // 10 mb
var BASE_DIR = __dirname + "/../public/files/";

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};
	
exports.getFile = function(req, res) {
	var file = req.params.id;
	console.log("get file :" + file);
	res.end("File id" + file);
};

exports.addFile = function(req, res) {

	var file = req.files.file;
	var tmpFile = file.path;
	var newFile = BASE_DIR + file.name;
	
	console.log("replace " + tmpFile + " to " + newFile);

	var is = fs.createReadStream(tmpFile);
	var os = fs.createWriteStream(newFile);

	util.pump(is, os, function() {
		fs.unlink(tmpFile, function(err) {
			if (err) {
				res.end("Error");
				console.log("FATAL!!!");
			} else {
				res.redirect("/");
			}
		})
	})
};