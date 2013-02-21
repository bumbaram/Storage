var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
	name: String,
	description: String,
	path: String
});

fileSchema.methods = {
};

var File = mongoose.model("File", fileSchema);

console.log("File model was created");
	