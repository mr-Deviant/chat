/**
* Module dependencies.
*/
var express  = require('express'),
	mongoose = require('mongoose'),
	crypto   = require('crypto');

var app = express();

app.set('env', 'development'); // By default set to 'development'

app.configure('development', function() {
	// Set server port
	app.set('port', process.env.PORT || 3000);
	// Set views folder path
	app.set('views', __dirname + '/views');
	// Set EJS as server templating system. Now we may not specify extension in res.render()
	app.set('view engine', 'html');
	// Register ejs as .html. Now we must name our views example.html instead of example.ejs
	app.engine('.html', require('ejs').__express);
	// Specify which folder NodeJs won't handle
	app.use(express.static(__dirname + '/app'));
	// Repacement for depricated express.bodyParser()
	app.use(express.json());
	app.use(express.urlencoded());
	// app.use(express.multipart()); - Depricated, but without it images upload won't work (or we can use other tool app.use(require('connect-multipart')()))

	// app.use(express.compress());

	// Connect to DB (local connection)
	mongoose.connect('mongodb://localhost/ChatDB');
	// Connection events
	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Connected to Mongoose');
	});
	// If the connection throws an error
	mongoose.connection.on('error', function (err) {
	  error.log('Could not connect to Mongoose: ' + err);
	});
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Disconnected from Mongoose');
	});
	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
		mongoose.connection.close(function () {
			console.log('Mongoose default connection disconnected through app termination');
			process.exit(0);
		});
	});
});

// Perform user registration
app.post('/register', function (req, res) {
	var User = require(__dirname + '/models/user');
	var result = {'success': 0};

	// Check if such user are not exists
	User.findOne({login: req.body.login}, function(err, docs) {
		if (err) {
			console.error('Could\'nt check if user exists: ' + err);
		} else {
			if (!docs) {
				// Insert user into DB
				var salt = Math.round(new Date().valueOf() * Math.random()) + ''
					hashPassword = crypto.createHash('sha512')
						.update(salt + req.body.password)
						.digest('hex');

				var userObj = new User({
					login: req.body.login,
					password: hashPassword,
					salt: salt,
					email: req.body.email,
					gender: req.body.gender,
					registerDate: new Date(),
					ip: req.ip
				});

				userObj.save(function(err, data) {
					if (err) {
						console.error('Could\'nt add new user: ' + err);
					} else {
						result.success = 1;
					}
					res.send(result);
				});
			} else {
				// Such user already exists
				//result.msg = 'USER_EXISTS';
			}
			res.send(result);
		}
	});
});


app.post('/login', function (req, res) {
	var User = require(__dirname + '/models/user');
	var result = {'success': 0};

	// Check if such user exists
	User.findOne({login: req.body.login}, function(err, doc) {
		if (err) {
			console.error('Could\'nt check if user exists: ' + err);
		} else {
			if (!doc) {
				// Such user aren't exists
				result.msg = 'USER_NOT_EXISTS';
			} else {
				// Check user password
				var hashPassword = crypto.createHash('sha512')
						.update(doc.salt + req.body.password)
						.digest('hex');

				if (hashPassword === doc.password) {
					result.success = 1;
				} else {
					result.msg = 'PASSWORD_WRONG';
				}
			}
			res.send(result);
		}
	});
});





app.get('/test/:id', function(req, res) {
	// Node variant
	// res.writeHead(200, {'Content-Type': 'text/plain'});
	// res.end('Test');

	// Express variant
	// var body = 'Test';
	// res.set({
	// 	'Content-Type': 'text/plain',
	// 	'Content-Length': body.length
	// });
	// res.end(body);

	// Express better variant
	var response = '';
	res.cookie('name', 'value', {maxAge: 24 * 60 * 60, secure: true}); // Get cookies: req.cookies.name
	response += req.params.id+'-=-'+req.param('id')+'-=-'+req.query.q+'-=-'+req.param('q')+'\r\n'; // 123-=-123-=-456-=-456
	response += req.ip+'\r\n'; // 127.0.0.1, for proxies: req.ips
	response += req.protocol+'://'+req.subdomains.join('.')+(req.subdomains.length ? '.' : '')+req.host+req.originalUrl+'\r\n'; // http://localhost/test/123/?q=456
	res.send(response);
	// res.json({name: 'value'});
	// res.redirect('/exit');
	// res.redirect('back');
});

// app.get('/', function(req, res) {

//     res.render('index.html');
// });

app.listen(app.get('port'));

console.log('Server running at http://localhost:3000');



// var mongoose = require('mongoose');
// // This setting only for local site
// mongoose.connect('mongodb://localhost/chat');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
	
// });