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
let x = 20,y=25;
let arrChess = new Array(x);
for(let i=0;i<x;i++){
    arrChess[i] = new Array(y); 
}
for(let i=0;i<x;i++){
    for(let j=0;j<y;j++){
        if(arrChess[i][j]==0){
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
        }else if(arrChess[i][j]==1){
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
        }
    }
}
io.on("connection",function(socket){
    //socket call
    listPlayer.push(socket.id);
    console.log("co nguoi ket noi!!"+socket.id);
    socket.emit("client-get-player",{gameFinish:gameFinish,listPlayer:listPlayer});
    socket.broadcast.emit("clients-get-new-player",{listPlayer:listPlayer});
    //
    if(gameFinish==false){
        gameFinish = true;
    }
    //socket listen
    socket.on("client-send-data",function(data){
        console.log(data);
    });
    socket.on("client-send-locateXO",function(data){
        updateDataGame(data.xflag,data.x,data.y);
        let xTurn = true;
        io.sockets.emit("server-send-data-for-all",data);
    });
    socket.on("client-request-datagame",function(){
        socket.emit("client-get-datagame",{arrChess:arrChess});
    });
    socket.on("disconnect",function(){
        //
        delPlayer(socket.id);
        io.sockets.emit("clients-get-delete-player",{listPlayer:listPlayer});
        console.log("co nguoi thoat!!"+socket.id);
    });
    socket.on("client-send-ready-play",function(data){
        //
        if(isPlaying(socket.id,data.ready)==true){
            reloadDataGame();
            io.sockets.emit("clients-can-play",{playing:true});
        }
        console.log("Nguoi choi da san sang!!"+socket.id);
    });
    socket.on("client-request-reload-game",function(data){
        //
        reloadDataGame();
        io.sockets.emit("server-send-reload-game-success");
    });
    socket.on("client-send-winner",function(data){
        //
        if(listPlayer.length>=2){
            player1Ready = false;player2Ready = false;
            if(listPlayer[0]==socket.id){
                io.sockets.emit("server-send-player-go-first",{idPlayer:listPlayer[1]});
            }else{
                io.sockets.emit("server-send-player-go-first",{idPlayer:listPlayer[0]});
            }
        }
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
        listPlayer.splice(vt,1);
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
        if(ready==true){
            player1Ready = true;
        }else{
            player1Ready = false;
        }
    }else if(vt==1){
        if(ready==true){
            player2Ready = true;
        }else{
            player2Ready = false;
        }
    }else{
        vt = -1;
    }
    if(player2Ready == true && player1Ready==true && vt != -1){
        return true;
    }else{
        return false;
    }
}
function updateDataGame(xflag,x,y){
    if(xflag==true){
        arrChess[x][y] = 1;
    }else{
        arrChess[x][y] = 0;
    }
}
function reloadDataGame(){
    player1Ready = false;
    player2Ready=false;
    //reset arr
    arrChess.slice(0,x);
    arrChess = new Array(x);
    for(let i=0;i<x;i++){
        arrChess[i] = new Array(y); 
    }
}
function orderPlayer(idPlayer){
    let vt=-1;
    for(let i=0;i<listPlayer.length;i++){
        if(idPlayer == listPlayer[i]){
            vt = i;break;
        }
    }
    return vt;
}