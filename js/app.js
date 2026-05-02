import "./audio.js";

const content = document.getElementById("content");

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", async () => {
    const level = link.dataset.level;
    if (!level) return;

    const res = await fetch(`data/${level}/vocab.json`);
    const data = await res.json();

    content.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.textContent = `${item.word} - ${item.meaning}`;

      div.onclick = () => playAudio(item.audio);

      content.appendChild(div);
    });
  });
});
