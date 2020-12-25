//xu ly ban co
const x = 10,y=9;
const distanceChess = 57;
const CHESSMOVETIME = 300;
let gameFinish = false;
let oldX=-1,oldY=-1;
//
let arrChess = new Array(x);
for(let i=0;i<x;i++){
    arrChess[i] = new Array(y).fill("");
}
jQuery('<div/>', {
    id: "pos-hide",
    "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
}).hide().appendTo('#khung-ban-co-2');
setupChessmans();
    for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            let posX = i * distanceChess;
            let posY = j * distanceChess;
            if(arrChess[i][j].length>0){
                jQuery('<div/>', {
                    id: "pos-"+i+"-"+j,
                    "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
                }).css({
                    "background-image": 'url("../Images/Xiangqi/'+ arrChess[i][j] +'")',
                    "top": posX+"px",
                    "left": posY+"px"
                }).appendTo('#khung-ban-co-2');
            }else{
                jQuery('<div/>', {
                    id: "pos-"+i+"-"+j,
                    "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
                }).css({
                    "top": posX+"px",
                    "left": posY+"px"
                }).appendTo('#khung-ban-co-2');
            }
            $("#pos-"+i+"-"+j).click(function() {
                //alert(oldX+":"+oldY+","+i+":"+j+","+arrChess[i][j]);
                if(arrChess[i][j]==""){
                    if(oldX!=-1){
                        checkMove(i,j);
                        chessMove(i,j);
                    }
                }else{
                    oldX = i;oldY = j;
                }
            });
        } 
    }
    function setupChessmans(){
        arrChess[0][0] = "chariot-black-1.png";
        arrChess[0][1] = "hourse-black-1.png";
        arrChess[0][2] = "elephant-black-1.png";
        arrChess[0][3] = "advisior-black-1.png";
        arrChess[0][4] = "general-black-1.png";
        arrChess[0][5] = "advisior-black-1.png";
        arrChess[0][6] = "elephant-black-1.png";
        arrChess[0][7] = "hourse-black-1.png";
        arrChess[0][8] = "chariot-black-1.png";
        //
        arrChess[9][0] = "chariot-red-1.png";
        arrChess[9][1] = "hourse-red-1.png";
        arrChess[9][2] = "elephant-red-1.png";
        arrChess[9][3] = "advisior-red-1.png";
        arrChess[9][4] = "general-red-1.png";
        arrChess[9][5] = "advisior-red-1.png";
        arrChess[9][6] = "elephant-red-1.png";
        arrChess[9][7] = "hourse-red-1.png";
        arrChess[9][8] = "chariot-red-1.png";
        //
        arrChess[2][1] = "cannon-black-1.png";
        arrChess[2][7] = "cannon-black-1.png";
        //
        arrChess[7][1] = "cannon-red-1.png";
        arrChess[7][7] = "cannon-red-1.png";
        //
        arrChess[3][0] = "soldier-black-1.png";
        arrChess[3][2] = "soldier-black-1.png";
        arrChess[3][4] = "soldier-black-1.png";
        arrChess[3][6] = "soldier-black-1.png";
        arrChess[3][8] = "soldier-black-1.png";
        //
        arrChess[6][0] = "soldier-red-1.png";
        arrChess[6][2] = "soldier-red-1.png";
        arrChess[6][4] = "soldier-red-1.png";
        arrChess[6][6] = "soldier-red-1.png";
        arrChess[6][8] = "soldier-red-1.png";
    }
    function chessMove(newX,newY){
        $("#pos-"+oldX+"-"+oldY).hide();
        $("#pos-hide").css({
            "background-image": 'url("../Images/Xiangqi/'+ arrChess[oldX][oldY] +'")',
            "top": oldX*distanceChess+"px",
            "left": oldY*distanceChess+"px",
            "z-index": 2
        }).show().animate({
            top: newX*distanceChess,
            left: newY*distanceChess
          }, CHESSMOVETIME, function() {
            // Animation complete.
            switchPos(oldX,oldY,newX,newY);
            arrChess[newX][newY] = arrChess[oldX][oldY];
            arrChess[oldX][oldY] = "";
            $("#pos-hide").hide();
            $("#pos-"+oldX+"-"+oldY).show();
            oldX=-1;oldY=-1;
        });
    }
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function switchPos(oldX,oldY,newX,newY){
        $( "#pos-"+oldX+"-"+oldY ).css({
            "background-image": 'none',
        });
        $( "#pos-"+newX+"-"+newY ).css({
            "background-image": 'url("../Images/Xiangqi/'+ arrChess[oldX][oldY] +'")',
        });
    }
    function checkMove(newX,newY){
        if(arrChess[oldX][oldY].indexOf("hourse")>=0){
            //alert("hourse");
        }else if(arrChess[oldX][oldY].indexOf("elephant")>=0){
            //alert("elephant");
        }else if(arrChess[oldX][oldY].indexOf("general")>=0){
            //alert("general");
        }else if(arrChess[oldX][oldY].indexOf("soldier")>=0){
            //alert("soldier");
        }else if(arrChess[oldX][oldY].indexOf("chariot")>=0){
            //alert("chariot");
        }else if(arrChess[oldX][oldY].indexOf("cannon")>=0){
            //alert("cannon");
        }else {
            alert("unknown");
        }
    }