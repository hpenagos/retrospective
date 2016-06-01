"use strict";
/* Number of trials by type */
var trialT1 = 4;
var trialT2 = 4;
var trialT3 = 3;
var trialT4 = 3;
var maxTrials = trialT1+trialT2+trialT3+trialT4;
var current = 0;
var test = false;

var instTime = Array(3).fill(0);
var presTime = Array(maxTrials).fill(0);
var selTime = Array(maxTrials).fill(0);
var cumpay = 0;

var TrialStartTime = 0;              /* Timestamp new trial events */
var MsgStartTime = 0;                /* Timestamp instruction display */
var blockN = 0;                      /* Indexes block number */

/* Keep track of selections and number of trials. Elements 0,2,4,6 track selections to the right-side options. Elements 1,3,5,7 track selections to the left-side options. Element 8 tracks overall number of trials*/
var counter = Array(9).fill(0);
var payoutsch = [0,0,0.01,0.05,0.05,0.01,0.20,0.25];    /* Payout schedule*/

var active = true;                /* Controls when clicking is available */
var newblock = true;              /* Controls whether to display instructions*/

/* Define geometric shapes */
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
function DrawTriangleUp(el,color,bkncolor,ro,lo,winWidth,winHeight){
    /* Determine the window's dimensions to size the triangle */
    var sidebd = Math.round(0.20*winWidth) + "px";
    var botbd = Math.round(0.40*winHeight) + "px";

    el.style.border = "initial";
    el.style.borderRadius = "0";
    el.style.width = "0";
    el.style.height = "0";
    el.style.borderLeft = "solid transparent";
    el.style.borderLeftWidth = sidebd;
    el.style.borderRight = "solid transparent";
    el.style.borderRightWidth = sidebd;
    el.style.borderTop = "0";
    el.style.borderBottomStyle = "solid";
    el.style.borderBottomColor = color;
    el.style.borderBottomWidth = botbd;
    el.style.display = "block";
    el.style.backgroundColor = bkncolor;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function DrawTriangleDn(el,color,bkncolor,ro,lo,winWidth,winHeight){
    /* Determine the window's dimensions to size the triangle */
    var sidebd = Math.round(0.20*winWidth) + "px";
    var topbd = Math.round(0.40*winHeight) + "px";

    el.style.border = "initial";
    el.style.borderRadius = "0";
    el.style.width = "0";
    el.style.height = "0";
    el.style.borderLeft = "solid transparent";
    el.style.borderLeftWidth = sidebd;
    el.style.borderRight = "solid transparent";
    el.style.borderRightWidth = sidebd;
    el.style.borderTopStyle = "solid ";
    el.style.borderTopColor = color;
    el.style.borderTopWidth = topbd;
    el.style.borderBottom = "0";
    el.style.display = "block";
    el.style.backgroundColor = bkncolor;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function DrawTrapezoid(el,color,bkncolor,ro,lo,winWidth,winHeigth){
    /* Determine the window's dimensions to size the trapezoid */
    var sidebd = Math.round(0.10*winWidth) + "px";
    var elwidth = Math.round(0.20*winWidth) + "px";
    var botbd = Math.round(0.40*winHeight) + "px";

    el.style.border = "initial";
    el.style.borderRadius = "0";
    el.style.width = elwidth;
    el.style.height = "0";
    el.style.borderLeft = "solid transparent";
    el.style.borderLeftWidth = sidebd;
    el.style.borderRight = "solid transparent";
    el.style.borderRightWidth = sidebd;
    el.style.borderTop = "0";
    el.style.borderBottomStyle = "solid ";
    el.style.borderBottomWidth = botbd;
    el.style.borderBottomColor = color;
    el.style.display = "block";
    el.style.backgroundColor = bkncolor;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function DrawRectangle(el,color,ro,lo,winWidth,winHeight){
    /* Determine the window's dimensions to size the rectangle */
    var elwidth = Math.round(0.40*winWidth) + "px";
    var elheight = Math.round(0.40*winHeight) + "px";

    el.style.border = "initial";
    el.style.borderRadius = "0";
    el.style.width = elwidth;
    el.style.height = elheight;
    el.style.borderLeft = "0";
    el.style.borderRight = "0";
    el.style.borderTop = "0";
    el.style.borderBottom = "0";
    el.style.display = "block";
    el.style.backgroundColor = color;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function DrawSquare(el,color,ro,lo,winWdidth,winHeight){
    /* Determine the window's dimensions to size the square */
    var elwidth = Math.round(0.35*winWidth) + "px";
    var topDist = Math.round((winHeight-elwidth)/2) + "px";

    el.style.border = "initial";
    el.style.borderRadius = "0";
    el.style.width = elwidth;
    el.style.height = elwidth;
    el.style.borderLeft = "0";
    el.style.borderRight = "0";
    el.style.borderTop = "0";
    el.style.borderBottom = "0";
    el.style.display = "block";
    el.style.backgroundColor = color;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function DrawCircle(el,color,ro,lo,winWidth,winHeight){
    /* Determine the window's dimensions to size the circle */
    var elwidth = Math.round(0.35*winWidth) + "px";
    var topDist = Math.round((winHeight-elwidth)/2) + "px";
    el.style.border = "initial";
    el.style.borderRadius = "50%";
    el.style.width = elwidth;
    el.style.height = elwidth;
    el.style.borderLeft = "0";
    el.style.borderRight = "0";
    el.style.borderTop = "0";
    el.style.borderBottom = "0";
    el.style.display = "block";
    el.style.backgroundColor = color;
    el.style.top = "30%";
    el.style.left = lo;
    el.style.right = ro;
};

function whichColor(el){
    var topColor = el.style.borderTopColor;
    var botColor = el.style.borderBottomColor;
    var bknColor = el.style.backgroundColor;

    if (topColor===botColor){
        return bknColor;
    }
    else {
        if (topColor==="initial"){
            return botColor;
        }
        else {
            return topColor;
        }
    }
};

/*This function determines what messages to display on each trial*/
function displayMessage(){

    document.getElementById("statescreen").style.display="none";
    document.getElementById("right_A").style.display="none";
    document.getElementById("left_A").style.display="none";
    document.getElementById("outcomescreen").style.display="none";

    var msgx = "0px";
    var msgy = "0px";
    var msgwidth = "100%";
    var msgheight = "100%";
    var msgdisp = "none";
    var instruct = "";
    var instcolor = "black";

    var ix = 0;

    if (counter[8] < trialT1) {
        if (counter[0]===0 && counter[1]===0){
            instruct = "Tap the screen to start";
            msgdisp = "block";
            instcolor = "black";
            ix = 0;
        }
        else {
            instruct = "";
            msgdisp = "none";
        }
    }

    else {

        if (counter[2]===0 && counter[3]===0) {
            instruct = "Tap the screen to continue";
            instcolor = "black";
            ix = 1;
        }
        else if (counter[4]===0 && counter[5]===0) {
            instruct = "Tap the screen to continue";
            instcolor = "black";
            ix = 2;
        }
        else {
            instruct = "";
        }
    }

    if (instruct.length>0) {
        msgdisp = "block";
    }
    else {
        msgdisp = "none";
    }

    var instdiv = document.getElementById("instruction");
    var messp = document.getElementById("inst_message");

    messp.innerHTML = instruct;
    instdiv.style.display = msgdisp;
    instdiv.style.left = msgx;
    instdiv.style.top = msgy;
    instdiv.style.width = msgwidth;
    instdiv.style.height = msgheight;
    instdiv.style.backgroundColor = instcolor;

    newblock = false;

    instTime[ix] = new Date().getTime();
};

/* Shuffle an array */
function shuffleArray(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled;
}


function TrialInfo(totalTrials){

    var stuff = new Array(trialT1+trialT2);
    for (var i=0; i<trialT1+trialT2; i++){
        stuff[i] = new Array();
        for (var j=0; j<5;j++){
            stuff[i][j] = 0;
        }
    }

    var thirdStage = new Array(trialT3+trialT4);
    for (var i=0; i<trialT3+trialT4; i++){
        thirdStage[i] = new Array();
        for (var j=0; j<8;j++){
            thirdStage[i][j] = 0;
        }
    }

    for (var i=0; i<trialT1; i++) {
        stuff[i][0] = function(){DrawTriangleUp(document.getElementById("right_A"),"#003300","black","5%","55%",winWidth,winHeight);};
        stuff[i][1] = function(){DrawTriangleDn(document.getElementById("left_A"),"#990000","black","55%","5%",winWidth,winHeight);};
        if (test===false) {
            stuff[i][2] = 0;
            stuff[i][3] = 0;}
        else {
            stuff[i][2] = 0.01;
            stuff[i][3] = 0.05;
        }
        stuff[i][4] = "#003300";
        stuff[i][5] = "#990000";
        stuff[i][6] = "black";
        stuff[i][7] = "none";
    }

    for (var i=trialT1; i<trialT1+trialT2; i++) {
        stuff[i][0] = function(){DrawTriangleUp(document.getElementById("right_A"),"#003300","black","5%","55%",winWidth,winHeight);};
        stuff[i][1] = function(){DrawTriangleDn(document.getElementById("left_A"),"#990000","black","55%","5%",winWidth,winHeight);};
        stuff[i][2] = 0.01;
        stuff[i][3] = 0.05;
        stuff[i][4] = "#003300";
        stuff[i][5] = "#990000";
        stuff[i][6] = "black";
        stuff[i][7] = "block";
    }

    for (var i=0; i<trialT3; i++) {
        thirdStage[i][0] = function(){DrawSquare(document.getElementById("right_A"),"#9900ff","7.5%","57.5%",winWidth,winHeight);};
        thirdStage[i][1] = function(){DrawCircle(document.getElementById("left_A"),"#ff6600","57.5%","7.5%",winWidth,winHeight);};
        thirdStage[i][2] = 0.05;
        thirdStage[i][3] = 0.01;
        thirdStage[i][4] = "#9900ff";
        thirdStage[i][5] = "#ff6600";
        thirdStage[i][6] = "#003300";
        thirdStage[i][7] = "block";
    }

    for (var i=trialT3; i<trialT3+trialT4; i++) {
        thirdStage[i][0] = function(){DrawTrapezoid(document.getElementById("right_A"),"#606060","#990000","5%","55%",winWidth,winHeight);};
        thirdStage[i][1] = function(){DrawRectangle(document.getElementById("left_A"),"#3333FF","55%","5%",winWidth,winHeight);};
        thirdStage[i][2] = 0.20;
        thirdStage[i][3] = 0.25;
        thirdStage[i][4] = "#606060";
        thirdStage[i][5] = "#3333FF";
        thirdStage[i][6] = "#990000";
        thirdStage[i][7] = "block";
    }

    var randarray = shuffleArray(thirdStage);

    for (var i=0; i<trialT3+trialT4; i++) {
        stuff.push(randarray[i]);
    }

    return stuff
}

var trials = TrialInfo(maxTrials);

function setUpTrial(rightid,leftid) {

    /* identify elements used to display choices */
    var statediv = document.getElementById("statescreen");
    var paydiv = document.getElementById("outcomescreen");
    var instdiv = document.getElementById("instruction");

    var payoutim = document.getElementById("Payout");
    var messp = document.getElementById("inst_message");

    var rightdiv = document.getElementById("right_A");
    var leftdiv = document.getElementById("left_A");

    if (counter[8] < maxTrials) {

        /* make state screen visible*/
        statediv.style.display = "block";
        statediv.style.width = "100%";
        statediv.style.height = "100%";
        statediv.style.top = "0px";
        statediv.style.left = "0px";
        /* make payout screen NOT visible*/
        paydiv.style.display = "none";
        paydiv.style.width = "100%";
        paydiv.style.height = "100%";
        paydiv.style.top = "0px";
        paydiv.style.left = "0px";

        trials[current][0]();
        trials[current][1]();
        statediv.style.backgroundColor = trials[current][6];
    }

    else {
        statediv.style.display = "none";
        paydiv.style.display ="none";

        rightdiv.style.display = "none";
        leftdiv.style.display = "none";

        instdiv.style.display = "block";
        instdiv.style.height = "100%";
        instdiv.style.backgroundColor = "black";

        var total = 0;
        for (var k=2;k<8;k++) {
            total += payoutsch[k]*counter[k];
        };

        messp.style.fontSize = "4em";
        var goodbyemssg = "Thank you for playing! ";
        messp.innerHTML = goodbyemssg.concat("<br>Today you earned $ ", cumpay.toFixed(2).toString());
        $.post("/dataRetro",trials);

    }
    TrialStartTime = new Date().getTime();
    active = true;
};

var main = function(){

    $('.mess_div').click(function(){
        instTime[0] = new Date().getTime();
        $.post("/test0");
        $(this).css("display","none");
        setUpTrial("right_A","left_A");
    });

    $('.sel_box').click(function() {
        presTime[current] = new Date().getTime();

        var id = $(this).attr("id");
        if (id === 'right_A') {$.post("/test1");} else {$.post("/test2");}
        var selected = document.getElementById(id);
        var newcolor = whichColor(selected);
        selected.style.backgroundColor = newcolor;

        selected.style.width = "100%";
        selected.style.height = "100%";
        selected.style.left = "0px";
        selected.style.top = "0px";
        selected.style.borderRadius = "0px";

        $(this).siblings().css("display","none");

        var paydiv = document.getElementById("outcomescreen");
        var payimg = document.getElementById("Payout");
        var statediv = document.getElementById("statescreen");

        statediv.style.display = "none";

        if (active) {

            var currpay = "$ ";

            paydiv.style.display = trials[current][7];
            paydiv.style.height = "100%";
            if (id==='right_A') {
                paydiv.style.backgroundColor = trials[current][4];
                cumpay = cumpay + trials[current][2];
                payimg.innerHTML = currpay.concat(trials[current][2].toFixed(2).toString());
            }
            else
            {
                paydiv.style.backgroundColor = trials[current][5];
                cumpay = cumpay + trials[current][3];
                payimg.innerHTML = currpay.concat(trials[current][3].toFixed(2).toString());
            }

            /* Disable clicking */
            counter[8]++;
            active = false;
            current++;

            if (counter[8]===trialT1 || counter[8]===trialT1+trialT2) {
                newblock = true;
                blockN++;
                /* Display choice for 2 sec and start a new block of trials */
                setTimeout(function(){displayMessage()},500);
            }
            else{
                /* Display choice for 2 sec and start new trial within current block */
                setTimeout(function(){setUpTrial("right_A","left_A")}, 500);
            }
        }
        else {
            return;
        }

    });
    displayMessage();
};

$(document).ready(main);
