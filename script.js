function login(){
let name = document.getElementById("user").value;
if(name==="") return;

localStorage.setItem("user",name);
localStorage.setItem("progress",0);

showDashboard();
}

function showDashboard(){
document.getElementById("loginPage").style.display="none";
document.getElementById("dashboard").style.display="block";

document.getElementById("name").innerText =
localStorage.getItem("user");
}

/* COURSE */
let lessons=[
["私は学生です","I am a student"],
["水を飲みます","I drink water"]
];

let i=0;

function openCourse(){
document.getElementById("dashboard").style.display="none";
document.getElementById("course").style.display="block";
showLesson();
}

function showLesson(){
document.getElementById("jp").innerText=lessons[i][0];
document.getElementById("en").innerText=lessons[i][1];
}

function next(){
i++;
if(i>=lessons.length) i=0;

let p = parseInt(localStorage.getItem("progress")||0);
p = Math.min(100,p+10);
localStorage.setItem("progress",p);
}

/* KANJI */
let kanji=["水 = Water","火 = Fire","日 = Sun"];
let k=0;

function openKanji(){
document.getElementById("dashboard").style.display="none";
document.getElementById("kanji").style.display="block";
showKanji();
}

function showKanji(){
document.getElementById("kdata").innerText=kanji[k];
}

function kanjiNext(){
k++;
if(k>=kanji.length) k=0;
showKanji();
}

function backDash(){
document.getElementById("kanji").style.display="none";
document.getElementById("dashboard").style.display="block";
}

function back(){
document.getElementById("course").style.display="none";
document.getElementById("dashboard").style.display="block";
}

function logout(){
localStorage.clear();
location.reload();
}
