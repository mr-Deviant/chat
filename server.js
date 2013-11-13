/**
* Module dependencies.
*/
var express = require('express');

var app = express();

app.set('env', 'development'); // By default set to 'development'

app.configure('development', function(){
	// Set server port
	app.set('port', process.env.PORT || 3000);
	// Set views folder path
	app.set('views', __dirname + '/app/views');
	// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.
	app.engine('.html', require('ejs').__express);
	// Set EJS as server templating system
	// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
	app.set('view engine', 'html');

	
	

	//app.use(express.static(__dirname + '/app'));
	// app.use(express.compress());
});

app.get('/login', function (req, res) {
    res.render('login');
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