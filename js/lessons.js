let lessons = [];
let index = 0;

async function loadLevel(level){
  let res = await fetch(`data/${level}.json`);
  lessons = await res.json();
  index = 0;
  showLesson();
}

function showLesson(){
  document.getElementById("jp").innerText = lessons[index].jp;
  document.getElementById("en").innerText = lessons[index].en;
}

function next(){
  index++;
  if(index >= lessons.length) index = 0;

  showLesson();

  let p = parseInt(localStorage.getItem("progress") || 0);
  p = Math.min(100, p + 5);
  localStorage.setItem("progress", p);
}
