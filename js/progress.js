function updateProgress(){
  let p = localStorage.getItem("progress") || 0;

  let bar = document.getElementById("bar");
  if(bar){
    bar.style.width = p + "%";
  }
}

function increaseProgress(value){
  let p = parseInt(localStorage.getItem("progress") || 0);
  p = Math.min(100, p + value);
  localStorage.setItem("progress", p);

  updateProgress();
}
