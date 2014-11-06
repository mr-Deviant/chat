var mongoose     = require('mongoose'),
	async        = require('async'),
	crypto       = require('crypto'),
	events       = require('events'),
	eventEmitter = new events.EventEmitter();

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
	gender: Boolean, // 1 - male, 0 - female
	registerDate: String,
	ip: String
});

userSchema.statics.register = function (req, callback) {
	// TODO: check login and password length
	async.waterfall([
		function (callback) { // Check if login is already in use
			mongoose.model('User').isRegistered(req.body.login, function (err, isRegistered) {
				var info = {};

				if (err) {
					console.log('Could not check if login is already in use');
				} else if (isRegistered) {
					info.msg = 'USER_EXISTS';
				}

				callback(err, isRegistered, info);
			});
		},
		function (isRegistered, info, callback) { // Register user if it not registered
			if (!isRegistered) {
				mongoose.model('User').addUser(req, function (err, user) {
					// TODO: Handle error
					callback(err, user, info);
				});
			} else {
				callback(null, false, info);
			}
		}
	], function (err, user, info) {
		if (err) {
			console.log('Could not complete register sequence');
			return callback(err);
		}

		return callback(null, user, info);
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
			console.error('Could not add user: ' + err);
			return callback(err);
		} else {
			// Fire add user event
			eventEmitter.emit('register');
			console.log('register');

			// Save user id in session
			//req.session.userId = user.id;
		}

		return callback(null, userObj);
	});
};

userSchema.statics.checkUser = function(req, callback) {
	// Check if such user exists
	this.findOne({login: req.body.login}, function(err, user) {
		var info = {};

		if (err) {
			console.error('Could not check if user exists: ' + err);
		} else {
			if (!user) {
				// Such user aren't exists
				info.msg = 'USER_NOT_EXISTS';
			} else {
				// Check user password
				var hashPassword = crypto.createHash('sha512')
						.update(user.salt + req.body.password)
						.digest('hex');

				if (hashPassword !== user.password) {
					user = false;
					info.msg = 'PASSWORD_WRONG';
				} else {
					// Fire add user event
					eventEmitter.emit('login');
					console.log('login');

					// Save user id in session
					//req.session.userId = user.id;
				}
			}
		}

		return callback(err, user, info);
	});
};

var User = mongoose.model('User', userSchema);

module.exports = User;