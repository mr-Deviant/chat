var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	id: {type: Number, unique: true},
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
// 	this.
// };

module.exports = User;