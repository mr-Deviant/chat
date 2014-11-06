var passport = require('passport');

module.exports = function (app) {
	'use strict';

	// Perform user registration
	app.post('/register', function (req, res) {
		passport.authenticate('register', function(err, user, info) {
			handleUserLogin(err, user, info, req, res)
		})(req, res);
	});

	// Perform user login
	app.post('/login', function(req, res) {
		passport.authenticate('login', function(err, user, info) {
			handleUserLogin(err, user, info, req, res)
		})(req, res);
	});

	app.get('/logout', function(req, res) {
		// if (req.isAuthenticated()) { return next(); }
		req.logout();
		res.end(JSON.stringify({'ok': 1}));
	});

	var handleUserLogin = function(err, user, info, req, res) {
		var ret = {
			ok: 0
		};

		if (err) {
			console.log('Could not handle user login: ' + err);
			res.end(JSON.stringify(ret));
		} else {
			if (!user) {
				if (info && info.msg) { // If error message exists add it into response
					ret.msg = info.msg;
				}
				res.end(JSON.stringify(ret));
			} else {
				// Perform user login
				req.logIn(user, function(err) {
					if (err) {
						console.log('Could not perform user login: ' + err);
					} else {
						// Everything went well
						ret.ok = !!user ? 1 : 0;
					}
			    });
			}
		}
		res.end(JSON.stringify(ret));
	};
};