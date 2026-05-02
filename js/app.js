document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const container = document.getElementById('lesson-container');
  const sectionTitle = document.getElementById('section-title');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const level = link.dataset.level;
      const section = link.dataset.section;

      if (level) {
        sectionTitle.innerHTML = `<h2>Level ${level.toUpperCase()}</h2>`;
        loadLevelSection(level);
      } else if (section) {
        sectionTitle.innerHTML = `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2>`;
        loadSection(section);
      }
    });
  });

  async function loadLevelSection(level) {
    container.innerHTML = `<p>Loading ${level.toUpperCase()} lessons...</p>`;
    // Load data (JSON) dynamically
    try {
      const response = await fetch(`data/${level}/vocabulary.json`);
      const vocabData = await response.json();
      displayItems(vocabData, 'Vocabulary');
    } catch (e) {
      container.innerHTML = `<p>No data available for ${level.toUpperCase()}</p>`;
    }
  }

  async function loadSection(section) {
    container.innerHTML = `<p>Loading ${section}...</p>`;
    try {
      const response = await fetch(`data/n5/${section}.json`);
      const data = await response.json();
      displayItems(data, section);
    } catch (e) {
      container.innerHTML = `<p>No data available for ${section}</p>`;
    }
  }

  function displayItems(data, type) {
    container.innerHTML = '';
    data.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'clickable-item';
      btn.innerHTML = generateItemHTML(item, type);
      btn.addEventListener('click', () => {
        if (item.audio) {
          new Audio(item.audio).play();
        }
      });
      container.appendChild(btn);
    });
  }

  function generateItemHTML(item, type) {
    if (type === 'Vocabulary') {
      return `<strong>${item.word}</strong><br/>${item.translation}`;
    } else if (type === 'Grammar') {
      return `<strong>${item.pattern}</strong><br/>${item.explanation}`;
    } else if (type === 'Sentence') {
      return `${item.sentence}`;
    } else if (type === 'Kanji') {
      return `<strong>${item.kanji}</strong>`;
    }
    return '';
  }
});
