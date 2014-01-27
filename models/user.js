var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: {type: Number},
	login: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	gender: Boolean,
	registerDate: {type: Date, default: Date.now},
	ip: String
});

var User = mongoose.model('User', UserSchema);

// User.prototype.addUser = function($data) {
// 	this.
// };

module.exports = User;