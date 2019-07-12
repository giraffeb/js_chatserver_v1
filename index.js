var db = require('./db/db')();
var User = require('./db/models/user')
var ChatRoom = require('./db/models/chatroom')

var app = require('./web/web_config')(__dirname);
var http = require('http').createServer(app);
var io = require('./socketio/socket')(http, User, ChatRoom);


var port = 8888;

app.get('/', function(req, res, next){
    res.sendFile(__dirname+'/static/html/index.html');
});

app.get('/login', function(req, res, next){
    res.sendFile(__dirname+'/static/html/login.html');
});


http.listen(port, function(){
    console.log("server started port -> ",port);
});