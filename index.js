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
let listPlayer = [];
let player1Ready = false,player2Ready = false;
io.on("connection",function(socket){
    //socket call
    listPlayer.push(socket.id);
    console.log("co nguoi ket noi!!"+socket.id);
    socket.emit("client-get-player",{gameFinish:gameFinish,listPlayer:listPlayer});
    socket.broadcast.emit("clients-get-listPlayer",{listPlayer:listPlayer});
    //
    if(gameFinish==false){
        gameFinish = true;
    }
    //socket listen
    socket.on("client-send-data",function(data){
        console.log(data);
    });
    socket.on("client-send-locateXO",function(data){
        socket.broadcast.emit("server-send-data",data);
    });
    socket.on("disconnect",function(){
        //
        delPlayer(socket.id);
        io.sockets.emit("clients-get-listPlayer",{listPlayer:listPlayer});
        console.log("co nguoi thoat!!"+socket.id);
    });
    socket.on("client-send-ready-play",function(data){
        //
        if(isPlaying(socket.id,data.ready)==true){
            io.sockets.emit("clients-can-play",{playing:true});
        }
        console.log("Nguoi choi da san sang!!"+socket.id);
    });
});
function delPlayer(idPlayer){
    let vt = -1;
    for(let i=0;i<listPlayer.length;i++){
        if(listPlayer[i]==idPlayer){
            vt = i;break;
        }
    }
    if(vt>=0){
        idPlayer = idPlayer.splice(vt+1,1);
    }
}
function isPlaying(idPlayer,ready){
    let vt = -1;
    for(let i=0;i<listPlayer.length;i++){
        if(listPlayer[i]==idPlayer){
            vt = i;break;
        }
    }
    if(vt==0){
        player1Ready = true;
    }else if(vt==1){
        player2Ready = true;
    }
    if(player2Ready == true && player1Ready==true){
        return true;
    }else{
        return false;
    }
}