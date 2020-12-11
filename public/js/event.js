$("#btn-play-gomoku").click(function() {
    restartGame();
});
$(".nav-link").click(function() {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});
socket.on("server-send-data",function(data){
    let i=data.x,j=data.y;
        if(xflag == true){
            xflag = false;
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess.png")');
            arrChess[i][j] = 1;
            
        }else{
            xflag = true;
            $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess.png")');
            arrChess[i][j] = 0;
        }
        findPlayerWin();
        gameFinish = false;
});
socket.on("client-get-player",function(data){
    gameFinish = data.gameFinish;
});