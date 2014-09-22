var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: String,
	login: {type: String, unique: true, required: true},
	password: String,
	email: String,
	gender: 1,
	registerDate: String,
	ip: String
});

module.exports = UserSchema;
