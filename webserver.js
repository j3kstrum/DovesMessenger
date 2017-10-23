//MongoDB @Author  Vikram Garu and Veronica Ng. 

var express = require('express');
var app = express();
//Code from Godaddy
const hostname = 'dovesmessenger.com';
//code from Godaddy
const port1 = '443';
//code from Godaddy
var https = require('https');

var fs = require("fs");
//Var options code from Godaddy with the corresponding File Path On my server. 
var options = {

 ca: fs.readFileSync('/var/SSL/dovesmessenger_com.ca-bundle'),
 key: fs.readFileSync('/etc/ssl/dovesmessenger.key'),
 cert: fs.readFileSync('/var/SSL/dovesmessenger_com.crt')

 };


var bodyParser = require("body-parser");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://104.131.3.139:27017";
 //code from Godaddy for testing purposes only. 
 




app.use(express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//Parses incoming requests with url encoded payloads

app.post('/login', function(req,res) {
console.log('Email:' + req.body.email);
console.log('password:' + req.body.password);
var y1=login(req.body.email,req.body.password);
y1.then(function(a){
if(!a){
res.write('0');
}
else{
secret = Math.random();
var retObj = 
{
email: req.body.email,
secret: secret

};

res.write(JSON.stringify(retObj));
}
console.log(a);
res.end();
}).catch(function error(err){
res.write('1');
console.log(err);
});
//res.write('1');
});

app.post('/register', function(req,res) {
console.log('email:' + req.body.email);
console.log('password:' + req.body.password);
console.log('name:' + req.body.name);
console.log('cell:' + req.body.cell);
//call registration, return '1' if success, '0' if failed ays
    var y2=insertUser(req.body.name,req.body.password,req.body.email,req.body.cell);
y2.then(function(a){
if(!a){
res.write('0');
}
else{
res.write('1');
}
res.end();
console.log(a);
}).catch(function error(err){
res.write('1');
console.log(err);
});
//res.write('0');
});

var httpsServer = https.createServer(options, app);

httpsServer.listen(port1,
 function() {
  console.log('HTTP listening on port ' + port1);
});

/*
//This is where I added 80
var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port
    //var port = '<443>';
  console.log("Example app listening at http://%s:%s", host, port)

})
*/



/* Below is the code for the WebSocket server */
/* @Author   Tian Qinxin and Jiewei Shen. */
//secret key to prevent hacking

//Referenced From  https://www.youtube.com/watch?v=3c9KDf5p_Vc
//Referenced From   https://www.youtube.com/watch?v=KNgWHVKJ6AE&list=PLIGDNOJWiL19GI17sMIEtlaNCVhUhRFPH


var secret = null;

const webSckSrv = require('ws');
var wssServer = https.createServer(options);
const wss= new webSckSrv.Server({ server: wssServer });
wssServer.listen(12345,function() { 
   console.log("wss listening on 12345");
});
function sckheartbeat() {
  this.isAlive = true;
   

}

wss.broadcast = function broadcast(s,ws) {
 
  wss.clients.forEach(function each(client) {
         if (typeof client.user != "undefined") {
        if(s == 1){
console.log("sending " + ws.msg + " to " + client.user);
                          client.send(ws.name + ": " + "'"+ ws.msg + "'");
        }
        if(s == 0){
        client.send(ws + " exit chatroom");
        }
         }
    });
};

// Referenced From  https://www.youtube.com/watch?v=QISU14OrRbI&list=PLfdtiltiRHWHZh8C2G0xNRbcf0uyYzzK_

//Referenced From  https://www.youtube.com/watch?v=czSfzG0EWUo&list=PLI-gk4ISRzCPlJjCz3yuAhL8vnmK6KWr7


wss.on('connection', function(ws, req) {
    console.log("connection");    
    var firstMessage = true;
    const ip = req.connection.remoteAddress;
    console.log(ip);
    const ip2 = req.headers['x-forwarded-for'];
    
ws.isAlive = true;
    ws.on('message', function(jsonStr,flags) {
console.log(jsonStr);
if(firstMessage)
{
firstMessage = false;
console.log("secret received = " + jsonStr);
console.log("secret stored = " + secret);
if(secret != jsonStr)
{
secret = null;
console.log("Secret failed, disconnecting");
ws.close();
return;
}
secret = null;
}
        var obj = eval('(' + jsonStr + ')');
        this.user = obj;
        if (typeof this.user.msg != "undefined") {
            wss.broadcast(1,obj);
              
        }
    });

    ws.on('close', function(close) {
        try{
        wss.broadcast(0,this.user.name);
        }catch(e){
        console.log('close, try to refresh.');
        }
    });

});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    //ws.isAlive = false;
      
    ws.ping('', false, true);
  });
}, 30000);
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
//I added the very last line here. 

//}).listen(port1);
