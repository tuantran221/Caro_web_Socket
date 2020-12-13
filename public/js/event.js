$(".nav-link").click(function() {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});
///
let socket = io();//setup socket
$("#btn-ready-gomoku-online").click(function(){
    if(unableBtnPlay == false){
        if($("#btn-ready-gomoku-online").hasClass("unready")==true){
            $("#btn-ready-gomoku-online").addClass("ready").removeClass("unready");
            $("#btn-ready-gomoku-online").text("Hủy sẵn sàng");
            canPlayStatus();
            socket.emit("client-send-ready-play",{ready:true});
        }else{
            $("#btn-ready-gomoku-online").addClass("unready").removeClass("ready");
            $("#btn-ready-gomoku-online").text("Sẵn sàng");
            socket.emit("client-send-ready-play",{ready:false});
        }
    }
});
socket.on("server-send-data-for-all",function(data){
    let i=data.x,j=data.y;
        if(isWatchOnly(socket.id)==false){
            if(data.xflag == true){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
                arrChess[i][j] = 1;
                if(xflag==true){
                    gameFinish = true;
                }else{
                    gameFinish = false;
                }
            }else{
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
                arrChess[i][j] = 0;
                if(xflag==false){
                    gameFinish = true;
                }else{
                    gameFinish = false;
                }
            }
            findPlayerWin();
        }else{//
            if(data.xflag == true){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
                arrChess[i][j] = 1;
            }else{
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
                arrChess[i][j] = 0;
            }
            findPlayerWin();
        }
});
socket.on("client-get-player",function(data){
    gameFinish = data.gameFinish;
    listPlayer = data.listPlayer;
    if(watchOnly(socket.id)==false){
        checkPlayer(socket.id);
    }else{
        socket.emit("client-request-datagame");
    }
    if(gameFinish==false){
        xflag = true;
    }else{
        xflag = false;
    }
});
socket.on("clients-get-listPlayer",function(data){
    listPlayer = data.listPlayer;
    if(watchOnly(socket.id)==false && listPlayer.length <= 2){// neu nguoi choi lon hon 2 khong can check
        checkPlayer(socket.id);
    }
});
socket.on("clients-can-play",function(data){
    if(watchOnly(socket.id)==false){
        restartGame();
        gameStop = false;
        unableBtnPlay = true;
        if(xflag == true){
            gameFinish = false;
        }else{
            gameFinish = true;
        }
        $(".p-wait-player").text("Đang chơi..");
    }else{
        restartGame();
    }
});
socket.on("client-get-datagame",function(data){
    arrChess = data.arrChess;
    loadDataGame();
});
socket.on("server-send-player-go-first",function(data){
    if(data.idPlayer == socket.id){
        xflag = true;
    }else{
        xflag = false;
    }
});
function checkPlayer(idPlayer){
    if(listPlayer.length>=2){
        canPlayStatus();
    }else{
        findPlayerStatus();
    }
}
function watchOnly(idPlayer){
    let vt=-1;
    for(let i=0;i<listPlayer.length;i++){
        if(idPlayer == listPlayer[i]){
            vt = i;break;
        }
    }
    if(vt>=0 && vt<=1){
        unableBtnPlay = false;
        return false;
    }else{
        gameStop = true;
        unableBtnPlay = true;
        setupStart();
        $(".p-wait-player").text("Chỉ xem..");
        return true;
    }
}
function canPlayStatus(){
    if($("#btn-ready-gomoku-online").hasClass("unready")==true){
        $(".p-wait-player").text("Tìm thấy người chơi.Hãy sẵn sàng..");
    }else{
        $(".p-wait-player").text("Đang chờ đối thủ sẵn sàng..");
    }
}
function findPlayerStatus(){
    $(".p-wait-player").text("Đang tìm đối thủ..");
}
function loadDataGame(){
    for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            if(arrChess[i][j]==0){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
            }else if(arrChess[i][j]==1){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
            }
        }
    }
    findPlayerWin();
}
function isWatchOnly(idPlayer){
    let vt=-1;
    for(let i=0;i<listPlayer.length;i++){
        if(idPlayer == listPlayer[i]){
            vt = i;break;
        }
    }
    if(vt>1||vt==-1){
        unableBtnPlay = true;
        return true;
    }else{
        return false;
    }
}