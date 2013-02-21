
/*
 * GET home page.
 */
var mongoose	= require('mongoose')
	, fs 	= require('fs')
	, util	= require('util')
	, File 	= mongoose.model('File');

var MAX_UPLOAD_SIZE = 1048576 * 10; // 10 mb
var BASE_DIR = __dirname + "/../public/files/";



exports.index = function(req, res){
	var files = File.find({}, function(err, docs) {
		if (err) {
			console.error("db error");
			res.end();
			return;
		}

		console.dir(docs);
		res.render('index', {title: 'All files', data: docs});
	});
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

	var path = BASE_DIR + (data.path).split('/').slice(-1)[0];

	var file = new File({
		name: data.name,
		description: req.body.description,
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