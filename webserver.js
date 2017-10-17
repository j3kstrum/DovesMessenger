//@Author  Tushar Seth, Jeiwei Shen, Qinxin Tian, Veronica Ng and Vikram Garu


//https://github.com/websockets/ws
//https://github.com/websockets/ws/blob/master/doc/ws.md#new-wsserveroptions-callback
//http://django-websocket-redis.readthedocs.io/en/latest/heartbeats.html

//http://nodejs.cn/api/http.html
//https://www.youtube.com/watch?v=uaizKlOXyfY
//https://www.youtube.com/watch?v=OjJ7XgWd9mQ
//https://www.youtube.com/watch?v=pNKNYLv2BpQ
//https://www.youtube.com/watch?v=HyGtI17qAjM
//https://www.youtube.com/watch?v=tHbCkikFfDE


/*The Websocket protocol implements so called PING/PONG messages to keep Websockets alive,
even behind proxies, firewalls and load-balancers. The server sends a 
PING message to the client through the Websocket, which then replies 
with PONG. If the client does not reply, the server closes the connection */


var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://104.131.3.139:27017";
var bcrypt = require('bcrypt');
removeDatabase(); //Remember to comment this line out. This line is just to create a new collection again as we didn't have security before
createDB();
createCollection();


app.use(express.static('.'));
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
//https://www.speedguide.net/port.php?port=8081
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

/* Below is the code for the WebSocket server */
//Referenced From  https://www.youtube.com/watch?v=3c9KDf5p_Vc
//Referenced From   https://www.youtube.com/watch?v=KNgWHVKJ6AE&list=PLIGDNOJWiL19GI17sMIEtlaNCVhUhRFPH

/*global object contains a sequence of numbers.
The Websocket protocol implements so called PING/PONG messages to keep Websockets alive,
even behind proxies, firewalls and load-balancers. The server sends a 
PING message to the client through the Websocket, which then replies 
with PONG. If the client does not reply, the server closes the connection.*/

var secret = null;
//https://stackoverflow.com/questions/27143585/node-js-script-websocket-error
//https://stackoverflow.com/questions/32985530/node-js-local-web-server-cant-find-module-ws-installed-globally
const webSckSrv = require('ws');
//https://www.speedguide.net/port.php?port=12345
//create the wss and then bind the port on it.
const wss= new webSckSrv.Server({ port: 12345 });
function sckheartbeat() {
  this.isAlive = true;
}
//use broadcast to dispatch msg
//Broadcast messages from a client to every other connected clients (without echoing to the sender)
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

/*The remote IP address can be obtained from the raw socket.
websocketserver, like a parent ws listen the connection, When there is a connection comes in then we pass the function.
Emitted when the handshake is complete. request is the http GET request sent by the client. Useful for parsing authority headers
cookie headers, and other information.*/
wss.on('connection', function(ws, req) {
    console.log("connection");   
    var firstMessage = true;
    //https://stackoverflow.com/questions/5999379/how-to-find-out-the-remote-address-in-node-js-if-it-is-https-request
    const ip = req.connection.remoteAddress;
    console.log(ip);
    //When the server runs behind a proxy like NGINX, the
    //de-facto standard is to use the X-Forwarded-For header.
    
    //const ip2 = req.headers['x-forwarded-for'];
    
  ws.isAlive = true;
    ws.on('message', function(jsonStr,flags) {
  console.log(jsonStr);
  if(firstMessage)
  {
    firstMessage = false;
   
    console.log("secret received = " + jsonStr);
    console.log("secret stored = " + secret);
    //When it is not the same, means someone is hacking so the ws closed immediately.
    if(secret != jsonStr)
    {
      secret = null;
      console.log("Secret failed, disconnecting");
      ws.close();
      return;
    }
    secret = null;
  }
  //var retObj = JSON.parse(r);
               //window.location.replace('client.html?' + encodeURIComponent("email") + '=' + encodeURIComponent(retObj.email) +
               //'&' + encodeURIComponent("secret") + '=' + encodeURIComponent(retObj.secret));
               /*The encodeURIComponent() function encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain
               characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape*/
               //sequences for characters composed of two "surrogate" characters).



               //Login is in the server, login with some variables, the server generates the secret, then passed back, redirect the page to the html
               //The email and secret back to the login.html, login.html creates the URL, forwarded to the client page, the client page it got the query
               //variable as secret, matches to what is stored on the server. As long as it loaded, open the socket, send the secret as the first message.
               //The reason why the first message will not be lost, is because we replace the first message with the secret.
        var obj = eval('(' + jsonStr + ')');
       
        this.user = obj;
        if (typeof this.user.msg != "undefined") {
          //ready state constant
            wss.broadcast(1,obj);
        }
    });

    ws.on('close', function(close) {
        try{
          //ready state constant
          wss.broadcast(0,this.user.name);
        }catch(e){
          console.log('close, try to refresh.');
        }
    });

});
/*30s
Sometimes the link between the server and the client can
be interrupted in a way that keeps both the server and the client
unaware of 
the broken state of the connection (e.g. when pulling the cord).
In these cases ping messages can be used as a means to verify that 
the remote endpoint is still responsive.*/
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    //ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 30000);

/*
Sources:
https://www.youtube.com/watch?v=yswb4SkDoj0
https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp
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
Remove the whole collection
*/
function removeDatabase(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("Users").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });
});
}