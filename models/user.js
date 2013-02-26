var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var userSchema = new Schema({
	nickname: String,
	password: String,
	name: String,
	secondname: String,
	lastname: String,
	email: String,
	roles: []
});

userSchema.methods = {	
};

var User = mongoose.model("User", userSchema);

console.log("User model was created");