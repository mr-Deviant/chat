/**
* Module dependencies.
*/
var express  = require('express'),
	mongoose = require('mongoose');

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

	// app.use(express.compress());
});

// Perform user registration
app.post('/register', function (req, res) {
	// This setting only for local site
	mongoose.connect('mongodb://localhost/chat');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		var User = require(__dirname + '/models/user');

		// Insert user into DB
		new User({
			_id: 1,
			login: 'login',
			password: 'password',
			email: 'mail@email.com',
			gender: 1,
			registerDate: new Date(),
			ip: req.ip
		});
	});

	res.send({'success': '1'});
});


app.get('/login', function (req, res) {
	var User = require(__dirname + '/models/user');

	// Perform user login

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