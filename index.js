var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
app.get("/playonlinegomoku",function(req,res){
    res.render("gomokuOnline",{page:"gomokuOnline"});
});
app.get("/",function(req,res){
    res.render("trangchu",{page:"gomoku2Player"});
});
//io
let gameFinish = false;
io.on("connection",function(socket){
    //
    console.log("co nguoi ket noi!!"+socket.id);
    socket.emit("client-get-player",{gameFinish:gameFinish});
    //
    if(gameFinish==false){
        gameFinish = true;
    }
    socket.on("client-send-data",function(data){
        console.log(data);
    });
    socket.on("client-send-locateXO",function(data){
        socket.broadcast.emit("server-send-data",data);
    });
});
