let time = 1500;

function startTimer() {
  const el = document.getElementById("time");

  const interval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    el.textContent = `${min}:${sec.toString().padStart(2,'0')}`;
    time--;

    if (time < 0) clearInterval(interval);

  }, 1000);
}
