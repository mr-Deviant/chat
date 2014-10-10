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

userSchema.methods.register = function (userData, callback) {
	try {
		async.waterfall([
			function (callback) {
				isRegistered(username, function (err, result) {
					callback(err, result);
				});
			},
			function (isRegistered, callback) {
				if (isRegistered) {
					addUser(userData, function (err, result) {
						callback(err, result);
					});
				}
			}
		], function (err, result) {
			if (err) {
				console.error('Couldn\'t register user: ' + err);
				throw err;
			}

			callback(null, result);
		});
	} catch(err) {
		console.log(err);
	}
};

userSchema.methods.isRegistered = function(login, callback) {
	this.model('User').findOne({'login': login}, function(err, docs) {
		if (err) {
			console.error('Couldn\'t check if user exists: ' + err);
			callback(err, false);
		} else {
			callback(null, !!docs);
		}
	});
};

userSchema.methods.addUser = function(userData, callback) {
	var salt = Math.round(new Date().valueOf() * Math.random()) + '',
		hashPassword = crypto.createHash('sha512')
			.update(salt + data.password)
			.digest('hex');

	data.salt = salt;
	data.registerDate = new Date();

	var userObj = new User(userData);

	userObj.save(function(err, data) {
		if (err) {
			console.error('Could\'nt add new user: ' + err);
			result.msg = 'COULD_NOT_ADD_USER';
		} else {
			result.success = 1;
			result.msg = 'USER_ADDED';
		}
		
		callback(null, result);
	});
};

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
