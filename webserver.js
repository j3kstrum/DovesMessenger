var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//Parses incoming requests with url encoded payloads

app.post('/login', function(req,res) {
	console.log('Email:' + req.body.email);
	console.log('password:' + req.body.password);
	var y1=login(req.body.email,req.body.password);
	y1.then(function(a){
		if(a){
			res.write('0');
		}
		else{
			res.write('1');
		}
		console.log(a);
	}).catch(function error(err){
		res.write('1');
		console.log(err);
	});
	//res.write('1');
	res.end();
});

app.post('/register', function(req,res) {
	console.log('email:' + req.body.email);
	console.log('password:' + req.body.password);
	console.log('name:' + req.body.name);
	console.log('cell:' + req.body.cell);
//call registration, return '1' if success, '0' if failed ays
    var y2=insertUser(req.body.name,req.body.password,req.body.email,req.body.cell);
	y2.then(function(a){
	if(a){
		res.write('0');
	}
	else{
		res.write('1');
	}
	console.log(a);
	}).catch(function error(err){
		res.write('1');
		console.log(err);
	});
	//res.write('0');
	res.end();
});
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

/*
Below is the code for the database
Creating a database
*/

function createDB(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database Successfully Created!");
  db.close();
});
}
/*
Creating a collection named Users
*/
function createCollection(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;25
  //Create a collection name "Users":
  db.createCollection("Users", function(err, res) {
    if (err) throw err;
    console.log("Collection Successfully Created!");
    db.close();
51  });
});
}
/*
Inserting a new user to Users with fields of name, password and email. More details can be added later
*/
function insertUser(name,password,email,phone){
createDB();
createCollection();
return new Promise(function(resolve,reject){
var promise=findUser(email);
var res=false;
promise.then(function(arr){
if(arr.length==0){
MongoClient.connect(url, function(err, db) {
   if (err) reject(err);
   var myobj = { username: name, password: password, email: email, phone: phone};
   db.collection("Users").insertOne(myobj, function(err, res) {
    if (err) reject(err) ;
    console.log("User Added");
    res=true;
    resolve(res);
    db.close();
});
});
}
else{
console.log("Username Already Exists");
resolve(res);
}
}).catch(function error(err){
reject(err);
});
});
}
/*
Shows all users present on our database
*/
function allUsers(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("Users").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}); 
}

/*
Looks for a user in our database. If user not present then throws error
*/
function findUser(em){
return new Promise(function(resolve,reject){
MongoClient.connect(url, function(err, db) {
  if (err) {reject(err);}
  var query = { email: em };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) {reject(err);// if empty array then wrong details entered so show enter correct username/password
    }
    db.close();
    resolve(result);
  });
});
});
}

/*
Login a user
*/    
function login(ulog,pass){
return new Promise(function(resolve,reject){
var promise=findUser(ulog);
var res=false;
promise.then(function(arr){
if(arr.length!=0){
if((arr[0].password).localeCompare(pass)==0){res=true;console.log("Successfully logged in");}
    else{console.log("Wrong Password");}
}
else{
console.log("Wrong Username");
}
resolve(res);
}).catch(function error(err){
reject(err);
});
});
}

/*
Delete user with a given email address
*/
function deleteUser(mail){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myquery = { email:mail};
   db.collection("Users").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " Users Deleted");
    db.close();
  });
});
}