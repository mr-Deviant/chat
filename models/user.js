var mongoose = require('mongoose'),
	async    = require('async');

var userSchema = mongoose.Schema({
	login: {type: String, unique: true, required: true},
	password: String,
	salt: String,
	email: String,
	gender: Boolean,
	registerDate: String,
	ip: String
});

userSchema.methods.register = function (cb) {
	//return this.model('User').find({ type: this.type }, cb);
}

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
