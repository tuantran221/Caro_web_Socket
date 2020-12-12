$(".nav-link").click(function() {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});
///
let socket = io();//setup socket
$("#btn-ready-gomoku").click(function(){
    if($("#btn-ready-gomoku").hasClass("unready")==true){
        $("#btn-ready-gomoku").addClass("ready").removeClass("unready");
        $("#btn-ready-gomoku").text("Hủy sẵn sàng");
        socket.emit("client-send-ready-play",{ready:true});
    }else{
        $("#btn-ready-gomoku").addClass("unready").removeClass("ready");
        $("#btn-ready-gomoku").text("Sẵn sàng");
        socket.emit("client-send-ready-play",{ready:false});
    }
});
socket.on("server-send-data",function(data){
    let i=data.x,j=data.y;//neu minh la X thi doi thu phai la O
        if(xflag == true){
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
            arrChess[i][j] = 0;
        }else{
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
            arrChess[i][j] = 1;
        }
        findPlayerWin();
        gameFinish = false;
});
socket.on("client-get-player",function(data){
    gameFinish = data.gameFinish;
    listPlayer = data.listPlayer;
    if(gameFinish==false){
        xflag = true;
    }else{
        xflag = false;
    }
});
socket.on("clients-get-listPlayer",function(data){
    listPlayer = data.listPlayer;
    checkPlayer();
});
socket.on("clients-can-play",function(data){
    gameStop = false;
    $(".p-wait-player").text("Đang chơi..");
});
function checkPlayer(){
    if(listPlayer.length>=2){
        canPlay();
    }else{
        findPlayer();
    }
}
function canPlay(){
    $(".p-wait-player").text("Đang chờ đối thủ sẵn sàng");
}
function findPlayer(){
    $(".p-wait-player").text("Đang tìm đối thủ");
}