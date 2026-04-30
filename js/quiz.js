let questions = [];
let qIndex = 0;

async function loadQuiz(level){
  let res = await fetch(`data/${level}.json`);
  questions = await res.json();
  qIndex = 0;
  showQuestion();
}

function showQuestion(){
  document.getElementById("question").innerText =
    questions[qIndex].q;

  document.getElementById("opt1").innerText =
    questions[qIndex].a;

  document.getElementById("opt2").innerText =
    questions[qIndex].b;
}

function answer(ans){
  if(ans === questions[qIndex].correct){
    alert("Correct 👍");
    increaseProgress(10);
  } else {
    alert("Wrong ❌");
  }

  qIndex++;
  if(qIndex < questions.length){
    showQuestion();
  }
}
