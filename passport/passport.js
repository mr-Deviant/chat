var passport      = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function (User) {
	'use strict';

	// Serialize users into and the session (save user id)
	passport.serializeUser(function(user, callback) {
		callback(null, user.id);
	});

	// Deserialize users out of the session (find user id)
	passport.deserializeUser(function(id, callback) {
		User.findById(id, function(err, doc) {
			if (err) {
				console.log('Could not deserialize user: ' + err);
				return callback(err);
			}

			callback(null, doc);
		});
	});

	// Passport register function
	passport.use('register', new LocalStrategy({
			usernameField: 'login',
			passwordField: 'password',
			passReqToCallback: true
		}, function(req, login, password, callback) {
			return User.register(req, callback);
		}
	));

	// Passport login function
	passport.use('login', new LocalStrategy({
			// Names of username & password fields
			usernameField: 'login',
			passwordField: 'password',
			passReqToCallback: true
		}, function(req, login, password, callback) {
			return User.checkUser(req, callback);
		}
	));
};