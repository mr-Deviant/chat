// Module dependencies
var express        = require('express'),
	cors           = require('cors'),
	favicon        = require('serve-favicon'),
	logger         = require('morgan'),
	cookieParser   = require('cookie-parser'),
	bodyParser     = require('body-parser'),
	// TODO: maybe use tokens instead? https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
	session        = require('express-session'),
	methodOverride = require('method-override'),
	mongoose       = require('mongoose'),
	MongoStore     = require('connect-mongo')(session),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local').Strategy, 
    settings       = {
    	serverHost  : 'localhost',
    	serverPort  : process.env.PORT || 3000,
    	clientHost  : 'localhost',
    	clientPort  : 9000,
    	dbName      : 'ChatDB',
    	cookieSecret: 'cccchhhaat'
    },
	app            = express(),
    server         = app.listen(settings.serverPort),
    io             = require('socket.io').listen(server);

console.log('Server running at http://' + settings.serverHost + ':' + settings.serverPort);

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

app.use(cookieParser()); // Need for passport 

app.use(bodyParser.urlencoded({extended: true})); // Need for passport

app.use(bodyParser.json());

app.use(methodOverride());

// Enable CORS for all requests
app.use(cors({
	// If I allow Access-Control-Allow-Credentials i cant use *
	origin: 'http://' + settings.clientHost + ':' + settings.clientPort,
	// Recieve cross domain requests with cookies data
	credentials: true
}));

// Need for pasport
app.use(session({
	// Session cookie is signed with this secret to prevent tampering
	secret: settings.cookieSecret,
	// Forces a session that is "uninitialized" to be saved to the store
	saveUninitialized: true,
	// Forces session to be saved even when unmodified
	resave: true,
	// Use MongoDB instead of MemoryStore for storing sessions
	store: new MongoStore({
	    db: settings.dbName
	})
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Specify which folder NodeJS won't handle
app.use(express.static(__dirname + '/app'));

// Connect to DB (local connection)
mongoose.connect('mongodb://' + settings.serverHost + '/' + settings.dbName);
// Connection events
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('Connected to Mongoose');
});
// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Could not connect to Mongoose: ' + err);
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

passport.use('register', new LocalStrategy({
		usernameField: 'login',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, login, password, callback) {
		return User.register(req, callback);
	}
));

// Passport login verify function
passport.use('login', new LocalStrategy({
		// Names of username & password fields
		usernameField: 'login',
		passwordField: 'password'
	}, function(login, password, callback) {
		return User.checkUser(login, password, callback);
	}
));

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

app.get('/logout', function(req, res){
	req.logout();
	res.end(JSON.stringify({'ok': 1}));
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