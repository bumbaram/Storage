
/*
 * GET home page.
 */
var fs 		= require('fs')
	, util	= require('util')
	, mongoose = require('mongoose')
	, File = mongoose.model('File');

var MAX_UPLOAD_SIZE = 1048576 * 10; // 10 mb
var BASE_DIR = __dirname + "/../public/files/";

exports.index = function(req, res){
	// var File = mongoose.model('File');
	var test = {
		name: "test file",
		description: "description for test",
		path: "/tmp/asdfa"
	}
	var f = new File(test);
	res.render('index', { title: 'Express' });
};
	
exports.getFile = function(req, res) {
	var file = req.params.id;
	console.log("get file :" + file);
	res.end("File id" + file);
};

exports.addFile = function(req, res) {
	if (!req.files || !req.files.file) {
		res.send(400, "Wrong request");
		return;
	}

	var data = req.files.file;

	if (data.size == 0) {
		fs.unlink(data.path);
		res.send(400, "Wrong request");
		return;
	}

	console.dir(req.files);

	var path = BASE_DIR + (data.path).split('/').slice(-1)[0];

	console.log("new file path: " + path);

	var file = new File({
		name: data.name,
		description: data.description,
		path: path
	});

	var is = fs.createReadStream(data.path);
	var os = fs.createWriteStream(file.path);

	util.pump(is, os, function() {
		fs.unlink(data.path, function(err) {
			if (err) {
				res.end("Error");
				console.log("FATAL!!!");
			} else {
				res.redirect("/");
			}
		})
	});

	//save data to database;
	file.save(function(err) {
		if (err) {
			console.error("can't save data to db");
		} else {
			console.info("file was saved to database");
		}
	});
};