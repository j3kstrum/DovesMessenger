var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var url = "mongodb://localhost:27017/mydb";

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//Parses incoming requests with url encoded payloads

app.post('/login', function(req,res) {
	console.log('Email:' + req.body.email);
	console.log('password:' + req.body.password);
	if(login(req.body.email,req.body.password)){
		res.write('0');
	}
	else{
		res.write('1');
	}
	//res.write('1');
	res.end();
});

app.post('/register', function(req,res) {
	console.log('email:' + req.body.email);
	console.log('password:' + req.body.password);
	console.log('name:' + req.body.name);
	console.log('cell:' + req.body.cell);
//call registration, return '1' if success, '0' if failed ays
    if(insertUser(req.body.name,req.body.password,req.body.email,req.body.cell)){
    	res.write('0');
    }
    else{
    	res.write('1');
    }
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
  if (err) throw err;
  //Create a collection name "Users":
  db.createCollection("Users", function(err, res) {
    if (err) throw err;
    console.log("Collection Successfully Created!");
    db.close();
  });
});
}
/*
Inserting a new user to Users with fields of name, password and email. More details can be added later
*/
function insertUser(name,password,email,phone){
createDB();
createCollection();
var flag=0;
MongoClient.connect(url, function(err, db) {
  if (err) {throw err;}
  var query = { email: email };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) {throw err;// if empty array then wrong details entered so show enter correct username/password
    }
    //console.log(result);
    db.close();
   if(result.length!=0){console.log("Username Already Exists"); flag=1;}
   else{
   MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var myobj = { username: name, password: password, email: email, phone: phone};
   //db.members.createIndex({ "email":email }, { unique: true });
   db.collection("Users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("User Added");
    db.close();
  });
}); 
}
  });
});
if(flag==0){
	return true;
}
else{
	return false;
}
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
MongoClient.connect(url, function(err, db) {
  if (err) {throw err;}
  var query = { email: em };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) {throw err;// if empty array then wrong details entered so show enter correct username/password
    }
    console.log(result);
    db.close();
   if(result.length==0){return false;}return true;
  });
});  
}
/*
Login a user
*/
function login(ulog,pass){
var flag=0;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { email: ulog };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result);// if empty array then wrong details entered so show enter correct username/password
    db.close();
    if(result.length==0){console.log("Wrong Username");return false;}
    if((result[0].password).localeCompare(pass)==0){console.log("Successfully logged in");}
    else{console.log("Wrong Password");flag=1;}
  });
});  
if(flag==0){
	return true;
}
else{
	return false;
}
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
