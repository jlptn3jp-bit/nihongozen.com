function updateProgress(){
let p=localStorage.getItem("progress")||0;
document.getElementById("bar").style.width=p+"%";
}
