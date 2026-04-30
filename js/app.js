function showUser(){
  let name = localStorage.getItem("user");

  if(!name){
    window.location.href = "login.html";
  }

  document.getElementById("name").innerText = name;
}

function goTo(page){
  window.location.href = page;
}

window.onload = showUser;
