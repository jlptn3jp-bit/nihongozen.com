function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if(user && pass){
        localStorage.setItem("user", user);
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter details");
    }
}
