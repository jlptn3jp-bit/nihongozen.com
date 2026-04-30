function login(){
let name = document.getElementById("name").value;

if(name === ""){
alert("Enter name");
return;
}

localStorage.setItem("user",name);

window.location.href="dashboard.html";
}
