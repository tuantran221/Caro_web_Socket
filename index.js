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
app.get("/listtablegomokuonline",function(req,res){
    res.render("listTableGomokuOnline",{page:"listTableGomokuOnline"});
});
app.get("/",function(req,res){
    res.render("trangchu",{page:"gomoku2Player"});
});
//io
let gameFinish = false;
let listPlayer = [];
let listPlayerName = [];
let player1Ready = false,player2Ready = false;
let x = 20,y=25;
let arrChess = new Array(x);
for(let i=0;i<x;i++){
    arrChess[i] = new Array(y); 
}
//
let roomNum = 12;
let arrRoom = new Array(roomNum);
for(let i=0;i<roomNum;i++){
    arrRoom[i] = new Array(2);
    arrRoom[i][0] = new Array();
    arrRoom[i][1] = new Array();
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
    listPlayer.push(socket.id);listPlayerName.push("");
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
    socket.on("client-send-username",function(data){
        let status = checkUsername(data.username,socket.id);
        if(status==true){
            socket.emit("server-send-signin-status",{status:status,username:data.username});
        }else{
            socket.emit("server-send-signin-status",{status:status});
        }
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
    socket.on("client-join-room",function(data){
        //
        arrRoom[data.idRoom][0].push(data.idPlayer);
        arrRoom[data.idRoom][1].push(data.username);
        io.sockets.emit("clients-update-list-room",{arrRoom:arrRoom});
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
        listPlayerName.splice(vt,1);
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
function checkUsername(username,idPlayer){
    if(username.length > 0 && username.length <= 20 && addUsername(username,idPlayer)==true){
        return true;
    }else{
        return false;
    }
}
function addUsername(username,idPlayer){
    let vt = listPlayer.indexOf(idPlayer);
    let containName = listPlayerName.indexOf(username);
    if(vt>-1 && containName==-1){
        listPlayerName[vt] = username;
        return true;
    }else{
        return false;
    }
}