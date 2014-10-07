var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: String,
	login: {type: String, unique: true, required: true},
	password: String,
	salt: String,
	email: String,
	gender: Boolean,
	registerDate: String,
	ip: String
});

module.exports = UserSchema;
