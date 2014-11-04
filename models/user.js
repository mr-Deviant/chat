var mongoose = require('mongoose'),
	async    = require('async'),
	crypto   = require('crypto');

var userSchema = mongoose.Schema({
	login: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	salt: String,
	email: String,
	gender: Boolean,
	registerDate: String,
	ip: String
});

userSchema.statics.register = function (req, callback) {
	// TODO: check login and password length
	async.waterfall([
		function (callback) { // Check if login is already in use
			mongoose.model('User').isRegistered(req.body.login, function (err, result) {
				var info = {};

				if (err) {
					console.log('Could not check if login is already in use');
				} else if (result) {
					info.msg = 'USER_EXISTS';
				}

				callback(err, result, info);
			});
		},
		function (isRegistered, info, callback) { // Register user if it not registered
			if (!isRegistered) {
				mongoose.model('User').addUser(req, function (err, result) {
					// TODO: Handle error
					callback(err, result, info);
				});
			} else {
				callback(null, false, info);
			}
		}
	], function (err, result, info) {
		if (err) {
			console.log('Could not complete register sequence');
			return callback(err);
		}

		return callback(null, result, info);
	});
};

userSchema.statics.isRegistered = function(login, callback) {
	this.findOne({'login': login}, function(err, docs) {
		if (err) {
			console.error('Could not check if user exists: ' + err);
			return callback(err);
		}
		
		return callback(null, !!docs);
	});
};

userSchema.statics.addUser = function(req, callback) {
	var salt = Math.round(new Date().valueOf() * Math.random()) + '',
		hashPassword = crypto.createHash('sha512')
			.update(salt + req.body.password)
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
			console.error('Could\'nt add user: ' + err);
			return callback(err);
		}

		return callback(null, true);
	});
};

// userSchema.statics.checkUser = function(req, callback) {
// 	var res = {
// 		success: false
// 	};

// 	// Check if such user exists
// 	this.findOne({login: req.body.login}, function(err, doc) {
// 		if (err) {
// 			console.error('Could\'nt check if user exists: ' + err);
// 		} else {
// 			if (!doc) {
// 				// Such user aren't exists
// 				res.msg = 'USER_NOT_EXISTS';
// 			} else {
// 				// Check user password
// 				var hashPassword = crypto.createHash('sha512')
// 						.update(doc.salt + req.body.password)
// 						.digest('hex');

// 				if (hashPassword === doc.password) {
// 					res.success = true;
// 				} else {
// 					res.msg = 'PASSWORD_WRONG';
// 				}
// 			}
// 		}

// 		return callback(err, res);
// 	});
// };

var User = mongoose.model('User', userSchema);

module.exports = User;