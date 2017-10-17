var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var url = "mongodb://localhost:27017/mydb";

var logval=1;

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
//createDB();
//createCollection();
return new Promise(function(resolve,reject){
var promise=findUser(email);
var res=false;
promise.then(function(arr){
if(arr.length==0){
MongoClient.connect(url, function(err, db) {
   if (err) reject(err);
   var salt=bcrypt.genSaltSync();
   var hash=bcrypt.hashSync(password,salt);
   var myobj = { username: name, password: hash, email: email, phone: phone};
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
    //console.log(result);
    db.close();
   //if(result.length==0){return false;}return true;
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
if(bcrypt.compareSync(pass,arr[0].password)){res=true;console.log("Successfully logged in");}
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
/*function login(mail,pass, callback){
callback(mail,pass);
//if(logval==0){return true;}else{return false;}
}*/

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



/*
For testing remove the needed comments under
*/

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
/*var y=insertUser("abc","password","abcde@buffalo.edu","123");
y.then(function(a){
console.log(a);
}).catch(function error(err){
console.log(err);
});*/
var y=login("abcde@buffalo.edu","paword");
y.then(function(a){
console.log(a);
}).catch(function error(err){
console.log(err);
});
//console.log(logval);
//var y1=login("abc@buffalo.edu","123");
//console.log(logval);
//var k=findUser("abcde@buffalo.edu");
//console.log(y1);
//var y=insertUser("abc","123","abc@buffalo.edu","123456");
//var z=deleteUser("abcde@buffalo.edu");
