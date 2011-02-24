var util   = require('util')
,   exec  = require('child_process').exec
,   ws = require('./lib/websocket/lib/ws/server')
,    child;


var server = ws.createServer({debug: false});

server.addListener("listening", function(){
  console.log("Listening for connections.");
});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
  conn.send("Connection: "+conn.id);

  conn.addListener("message", function(cmd){
    var cmd = JSON.parse(cmd);

    console.log("<"+conn.id+"> "+ cmd.title + ' $$ '+ cmd.body);
    child = exec('growlnotify -m "'+cmd.body+'" -t "'+cmd.title+'"',
        function (error, stdout, stderr) {
    });
    
  });
});

server.addListener("error", function(){
  console.log(Array.prototype.join.call(arguments, ", "));
});

server.addListener("disconnected", function(conn){
  server.broadcast("<"+conn.id+"> disconnected");
});

server.listen(8000);