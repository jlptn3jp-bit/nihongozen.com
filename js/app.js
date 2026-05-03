const levels = [
  { name: "N5 Basics", path: "data/n5/vocab.json" },
  { name: "N4 Coming Soon" },
  { name: "N3 Coming Soon" }
];

const container = document.getElementById("levels");

levels.forEach(level => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerText = level.name;

  card.onclick = () => {
    if (level.path) {
      loadLevel(level.path);
    } else {
      alert("Coming Soon");
    }
  };

  container.appendChild(card);
});

async function loadLevel(path) {
  const res = await fetch(path);
  const data = await res.json();
  console.log(data);
}
