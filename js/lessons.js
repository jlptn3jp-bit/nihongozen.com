// lessons.js
async function loadLessonData(level, type) {
  const response = await fetch(`/data/${level}/${type}.json`);
  const data = await response.json();
  displayLessonItems(data, type);
}

function displayLessonItems(data, type) {
  const container = document.getElementById('content');
  container.innerHTML = '';
  data.forEach(item => {
    const elem = document.createElement('button');
    elem.className = 'clickable-item';
    elem.textContent = item.word || item.sentence || item.grammar;
    elem.addEventListener('click', () => playAudio(item.audio));
    container.appendChild(elem);
  });
}

function playAudio(audioPath) {
  const audio = new Audio(audioPath);
  audio.play();
}
