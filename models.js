var mongoose = require('mongoose')
	, fs = require('fs');

var MODELS_DIR = __dirname + "/models/";


fs.readdirSync(MODELS_DIR).forEach(function(file) {
	require(MODELS_DIR + file);
});
