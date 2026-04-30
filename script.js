function login(){
let name=document.getElementById("user").value;
if(name==="")return;

localStorage.setItem("user",name);
localStorage.setItem("progress",0);

window.location.href="dashboard.html";
}
