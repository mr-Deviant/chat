var express = require('express');
var app = express();

// app.use(express.compress());

app.use(express.static(__dirname + '/app'));

// app.get('/', function(req, res) {

//     res.render('index.html');
// });

app.listen(process.env.PORT || 3000);