var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	login: {type: String, required: true, trim: true, unique: true},
	password: {type: String, required: true},
	salt: {type: String, required: true},
	email: {type: String, required: true, trim: true},
	gender: Boolean,
	registerDate: {type: Date, default: Date.now},
	ip: String
});

var User = mongoose.model('User', UserSchema);

// User.prototype.addUser = function($data) {
// 	
// };

module.exports = User;