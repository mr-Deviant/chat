// Module dependencies
var express        = require('express'),
	favicon        = require('serve-favicon'),
	logger         = require('morgan'),
	cookieParser   = require('cookie-parser'),
	bodyParser     = require('body-parser'),
	session        = require('express-session'),
	methodOverride = require('method-override'),
	mongoose       = require('mongoose'),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local').Strategy, 
	app            = express(),
    server         = app.listen(process.env.PORT || 3000),
    io             = require('socket.io').listen(server);

    var crypto   = require('crypto');

console.log('Server running at http://localhost:3000');

app.set('env', process.env.NODE_ENV.trim() || 'development'); // By default set to 'development'

// Set views folder path
app.set('views', __dirname + '/views');

// Set EJS as server templating system. Now we may not specify extension in res.render()
app.set('view engine', 'html');

// Register ejs as .html. Now we must name our views example.html instead of example.ejs
app.engine('html', require('ejs').__express); // Not mention in example

// Serve a favicon
app.use(favicon(__dirname + '/app/favicon.ico'));

// Log all requests
// Disable logging for static content requests by loading the logger after the static middleware
if ('development' === app.get('env')) {
	app.use(logger('dev'));
} else { // Production
	app.use(logger('combined'));
}

app.use(cookieParser('keyboard cat')); // Need for passport 

app.use(bodyParser.urlencoded({extended: true})); // Need for passport

app.use(bodyParser.json());

app.use(methodOverride());

// Need for pasport
app.use(session({
	// Session cookie is signed with this secret to prevent tampering
	secret: 'keyboard cat',
	// Forces a session that is "uninitialized" to be saved to the store
	saveUninitialized: true,
	// Forces session to be saved even when unmodified
	resave: true
	,cookie: {secure: false}//
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Specify which folder NodeJS won't handle
app.use(express.static(__dirname + '/app'));


var flash = require('connect-flash');//
app.use(flash());//


// Connect to DB (local connection)
mongoose.connect('mongodb://localhost/ChatDB');
// Connection events
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('Connected to Mongoose');
});
// If the connection throws an error
mongoose.connection.on('error', function(err) {
  error.log('Could not connect to Mongoose: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Disconnected from Mongoose');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

var User = require(__dirname + '/models/user');

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {console.log('!!!deserialize!!!', id);
	User.findById(id, function(err, doc) {
		if (err) {
			console.error('Could not deserialize user: ' + err);
			return callback(err);
		}

		callback(null, doc);
	});
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use('login', new LocalStrategy({
		usernameField: 'login',
		passwordField: 'password'
	}, function(login, password, callback) {
		
			User.findOne({login: login}, function(err, doc) {
				if (err) {
					console.error('Could not check if user exists: ' + err);
					return callback(err);
				}

				if (!doc) {
					return callback(null, false, {message: 'Incorrect login'});
				}

				var hashPassword = crypto.createHash('sha512')
					.update(doc.salt + password)
					.digest('hex');

				if (doc.password != hashPassword) {
					return callback(null, false, {message: 'Incorrect password'});
				}

				return callback(null, doc);
			});
		
	}
));

// passport.use('register', new LocalStrategy({
// 		usernameField: 'login',
// 		passwordField: 'password',
// 		passReqToCallback: true
// 	},
// 	function(req, username, password, callback) {

// 	}
// ));

// Allow cross domain requests (because NodeJS is on different port)
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

// Perform user registration
app.post('/register', function (req, res) {
	// var user = require(__dirname + '/models/user');

	try {
		user.register(req, function(err, result) {
			res.send(result);
		});
	} catch(err) {
		console.error('Could not register user: ' + err);
	}
});

// Perforem user login
app.post('/login', function(req, res, next) {
	console.log('-='+req.isAuthenticated()+'=-');
	passport.authenticate('login', function(err, user, info) {
		if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.login(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      console.log('registered');
      console.log('-='+req.isAuthenticated()+'=-');
      res.end('s');
    });
	})(req, res, next);



	// var user = require(__dirname + '/models/user');
	
	// try {
	// 	user.checkUser(req, function(err, result) {
	// 		res.send(result);
	// 	});
	// } catch(err) {
	// 	console.error('Could not check user: ' + err);
	// }
});

app.get('/chat', function(req, res) {
	console.dir(req.cookies);
	console.log(req.isAuthenticated());
	res.end(req.isAuthenticated()+'=-');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
});

io.on('connect', function(socket) {
	console.log('server: socket connected');

	// Store user in table of online users
	var onlineUser = require(__dirname + '/models/online-user');
	//onlineUser.addUser(XXX);

	

	socket.emit('message', { message: 'welcome to the chat' });

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

io.on('disconnect', function() {
	// Delete user from table of online users
	var onlineUser = require(__dirname + '/models/online-user');
	//onlineUser.removeUser(XXX);
});


// app.get('/test/:id', function(req, res) {
// 	// Node variant
// 	// res.writeHead(200, {'Content-Type': 'text/plain'});
// 	// res.end('Test');

// 	// Express variant
// 	// var body = 'Test';
// 	// res.set({
// 	// 	'Content-Type': 'text/plain',
// 	// 	'Content-Length': body.length
// 	// });
// 	// res.end(body);

// 	// Express better variant
// 	var response = '';
// 	res.cookie('name', 'value', {maxAge: 24 * 60 * 60, secure: true}); // Get cookies: req.cookies.name
// 	response += req.params.id+'-=-'+req.param('id')+'-=-'+req.query.q+'-=-'+req.param('q')+'\r\n'; // 123-=-123-=-456-=-456
// 	response += req.ip+'\r\n'; // 127.0.0.1, for proxies: req.ips
// 	response += req.protocol+'://'+req.subdomains.join('.')+(req.subdomains.length ? '.' : '')+req.hostname+req.originalUrl+'\r\n'; // http://localhost/test/123/?q=456
// 	res.send(response);
// 	// res.json({name: 'value'});
// 	// res.redirect('/exit');
// 	// res.redirect('back');
// });

// app.get('/', function(req, res) {

//     res.render('index.html');
// });