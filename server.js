// Module dependencies
var express        = require('express'),
	favicon        = require('serve-favicon'),
	logger         = require('morgan'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	mongoose       = require('mongoose'),
	app            = express();

app.set('env', 'development'); // By default set to 'development'

//app.set('appPath', __dirname + '/app');

// Set server port
app.set('port', process.env.PORT || 3000);

// Set views folder path
app.set('views', __dirname + '/views');

// Set EJS as server templating system. Now we may not specify extension in res.render()
app.set('view engine', 'html');

// Register ejs as .html. Now we must name our views example.html instead of example.ejs
app.engine('html', require('ejs').__express); // Not mention in example

// Serve a favicon
app.use(favicon(__dirname + '/app/favicon.ico'));

// Specify which folder NodeJS won't handle
app.use(express.static(__dirname + '/app'));

// Log all requests
// Disable logging for static content requests by loading the logger after the static middleware
if ('development' === app.get('env')) {
	app.use(logger('dev'));
} else { // Production
	app.use(logger('combined'));
}

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(methodOverride());

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

// Allow cross domain requests (because NodeJS is on different port)
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

// Perform user registration
app.post('/register', function (req, res) {
	var User = require(__dirname + '/models/user');

	try {
		User.register(req, function(err, result) {
			res.send(result);
		});
	} catch(err) {
		console.error('Couldn\'t register user: ' + err);
	}
});

app.post('/login', function (req, res) {
	var User = require(__dirname + '/models/user');
	
	try {
		User.checkUser(req, function(err, result) {
			res.send(result);
		})
	} catch(err) {
		console.error('Couldn\'t check user: ' + err);
	}
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
	response += req.protocol+'://'+req.subdomains.join('.')+(req.subdomains.length ? '.' : '')+req.hostname+req.originalUrl+'\r\n'; // http://localhost/test/123/?q=456
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