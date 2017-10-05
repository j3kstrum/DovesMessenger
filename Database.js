var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var url = "mongodb://localhost:27017/mydb";
/*
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
function insertUser(name,password,email){
MongoClient.connect(url, function(err, db) {
  if (err) {throw err;}
  var query = { email: email };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) {throw err;// if empty array then wrong details entered so show enter correct username/password
    }
    //console.log(result);
    db.close();
   if(result.length!=0){console.log("Username Already Exists");}
   else{
   MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var myobj = { username: name, password: password, email: email};
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
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { email: ulog };
  db.collection("Users").find(query).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result);// if empty array then wrong details entered so show enter correct username/password
    db.close();
    if(result.length==0){console.log("Wrong Username");return false;}
    if((result[0].password).localeCompare(pass)==0){console.log("Successfully logged in");return true;}
    else{console.log("Wrong Password");return false;}
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

/*bcrypt.hash("GuessMe", 10, function(err, hash) {
  // Store hash in your password DB.
console.log(hash);
});*/
/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { username: "Vikram Garu", password: "guessMe", email: "vikramga@buffalo.edu" };
  db.collection("Users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("Document inserted");
    db.close();
  });
});
*/
//var x=insertUser("Vikram","pass","em");
//var y=allUser();
/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("Users").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
  });
});*/
//var w=allUsers();
//var x=findUser("vikramga@buffalo.edu");
//var y=insertUser("name","pass","em");
//var z=deleteUser("em");
//console.log(y);
