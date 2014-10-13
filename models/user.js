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

userSchema.statics.register = function (req, callback) {
	// try {
		var res = {
			success: 0
		};

		async.waterfall([
			function (callback) {
				isRegistered(req.body.login, result, function (err, result) {
					if (!err && !result) {
						res.msg = 'USER_EXISTS';
					}
					
					return callback(err, result);
				});
			},
			function (isRegistered, callback) {
				if (isRegistered) {
					addUser(req, result, function (err, result) {
						return callback(err, result);
					});
				}
			}
		], function (err, result) {
			if (err) {
				return callback(err);
			}

			res.success = 1;

			return callback(null, res);
		});
	// } catch(err) {
	// 	console.error(err);
	// }
};

userSchema.statics.isRegistered = function(login, callback, result, msg) {
	this.model('User').findOne({'login': login}, function(err, docs) {
		if (err) {
			console.error('Couldn\'t check if user exists: ' + err);
			return callback(err);
		}

		var isRegistered = !!docs;
		result = result && isRegistered;
		
		msg = isRegistered ? 'USER_ADDED' : 'USER_EXISTS';
		
		return callback(null, result, msg);
		
	});
};

userSchema.statics.addUser = function(req, result, callback) {
	var salt = Math.round(new Date().valueOf() * Math.random()) + '',
		hashPassword = crypto.createHash('sha512')
			.update(salt + userData.password)
			.digest('hex'),
		userData = {
			login: req.body.login,
			password: hashPassword,
			salt: salt,
			email: req.body.email,
			gender: req.body.gender,
			registerDate: new Date(),
			ip: req.ip
		};

	var userObj = new User(userData);

	userObj.save(function(err, userObj) {
		if (err) {
			console.error('Could\'nt add new user: ' + err);
			return callback(err);
		}

		result.success = result.success && 1;
		return callback(null, result);
	});
};

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
