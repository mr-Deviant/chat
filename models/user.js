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
	var res = {
		success: false
	};

	async.waterfall([
		function (callback) { // Check if user registered
			mongoose.model('User').isRegistered(req.body.login, function (err, result) {
				if (!err && result) {
					res.msg = 'USER_EXISTS';
				}
				
				callback(err, result);
			});
		},
		function (isRegistered, callback) { // Register user if it not registered
			if (!isRegistered) {
				mongoose.model('User').addUser(req, function (err, result) {
					callback(err, result);
				});
			} else {
				callback(null, false);
			}
		}
	], function (err, result) {
		if (err) {
			return callback(err);
		}

		res.success = result;

		return callback(null, res);
	});
};

userSchema.statics.isRegistered = function(login, callback) {
	this.findOne({'login': login}, function(err, docs) {
		if (err) {
			console.error('Couldn\'t check if user exists: ' + err);
			return callback(err);
		}

		var isRegistered = !!docs;
		
		msg = isRegistered ? 'USER_ADDED' : 'USER_EXISTS';
		
		return callback(null, isRegistered);
		
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

userSchema.statics.checkUser = function(req, callback) {
	var res = {
		success: false
	};

	// Check if such user exists
	this.findOne({login: req.body.login}, function(err, doc) {
		if (err) {
			console.error('Could\'nt check if user exists: ' + err);
		} else {
			if (!doc) {
				// Such user aren't exists
				res.msg = 'USER_NOT_EXISTS';
			} else {
				// Check user password
				var hashPassword = crypto.createHash('sha512')
						.update(doc.salt + req.body.password)
						.digest('hex');

				if (hashPassword === doc.password) {
					res.success = true;
				} else {
					res.msg = 'PASSWORD_WRONG';
				}
			}
		}

		return callback(err, res);
	});
};

var User = mongoose.model('User', userSchema);

module.exports = User;