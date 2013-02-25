var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var userSchema = new Schema({
	nickname: String,
	name: String,
	secondName: String,
	lastName: String,
	email: String
});

userSchema.methods = {	
};

var User = mongoose.model("User", userSchema);

console.log("User model was created");