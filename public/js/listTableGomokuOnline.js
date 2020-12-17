$(document).ready(function(){
    let socket = io();//setup socket
    let username = "";
    //
    let roomNum = 12;
    let arrRoom = [];
    $(".table-image").attr("src", "../Images/tables/table-0.png");
    $("#btn-submit-login").click(function(){
        username = $("#username-input").val();
        socket.emit("client-send-username",{username:username});
    });
    $("#btn-sign-in").click(function(){
        if($("#btn-sign-in").hasClass("hello-name")==true){
            //do stop
            $("#signInModal").prop('id', 'signInModal-unable');
        }else{
            $("#signInModal-unable").prop('id', 'signInModal');
            $(".notice-error").hide();
        }
    });
    //
    for(let i=1;i<=12;i++){
        $("#my-div-table-id-"+i).click(function(){
            let idRoom = i-1;
            if(username!=""){
                socket.emit("client-join-room",{idRoom:idRoom,idPlayer:socket.id,username:username});
            }
        })
    }
    //socket
    socket.on("server-send-signin-status",function(data){
        if(data.status==true){
            //login success
            let helloName = "Xin chào "+ data.username;
            $("#btn-cancel-login").click();
            $("#btn-sign-in").addClass("hello-name").text(helloName);
            alert("Đăng ký thành công");
        }else{
            let textError = "Có lỗi, có thể do trùng tên hoặc tên của bạn không đúng định dạng.";
            $(".notice-error").text(textError).show();
        }
    });
    socket.on("clients-update-list-room",function(data){
        arrRoom = data.arrRoom;
        reloadRoom();
    });
    function reloadRoom(){
        console.log(arrRoom);
        for(let i=0;i<roomNum;i++){
            if(arrRoom[i][0].length==0){
                $("#table-"+i+"-img").attr("src", "../Images/tables/table-0.png");
            }else if(arrRoom[i][0].length==1){
                $("#table-"+i+"-img").attr("src", "../Images/tables/table-1.png");
            }else{
                $("#table-"+i+"-img").attr("src", "../Images/tables/table-2.png");
            }
        }
    }
});