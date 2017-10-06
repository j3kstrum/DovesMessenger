var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', function(req,res) {
	console.log('Email:' + req.body.email);
	console.log('password:' + req.body.password);
	res.write('1');
	res.end();
});

app.post('/register', function(req,res) {
	console.log('email:' + req.body.email);
	console.log('password:' + req.body.password);
	console.log('name:' + req.body.name);
	console.log('cell:' + req.body.cell);
//call registration, return '1' if success, '0' if failed ays

	res.write('0');
	res.end();
});
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
