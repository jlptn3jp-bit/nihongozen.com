function login(){
  let name = document.getElementById("user").value;

  if(name === ""){
    alert("Enter your name");
    return;
  }

  localStorage.setItem("user", name);
  localStorage.setItem("progress", 0);

  window.location.href = "dashboard.html";
}

function logout(){
  localStorage.clear();
  window.location.href = "login.html";
}
