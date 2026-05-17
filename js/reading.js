
/**
 * NihongoZen — Reading Module
 * Fetches from data/reading/{level}.json
 * Independent module — no global dependencies required
 */

const NZReading = (() => {
  let currentLevel = 'n5';
  let passages = [];
  let currentPassage = null;
  let currentQ = 0;
  let score = 0;
  let answered = false;

  // ── FETCH ──────────────────────────────────────────────────────────────────
  async function loadPassages(level) {
    try {
      const res = await fetch(`data/reading/${level}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      passages = await res.json();
      return passages;
    } catch (e) {
      console.warn('Reading data load failed:', e);
      passages = [];
      return [];
    }
  }

  // ── RENDER PASSAGE LIST ────────────────────────────────────────────────────
  function renderList(container) {
    if (!passages.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--l-text2)">
          <div style="font-size:2.5rem;margin-bottom:1rem">📖</div>
          <p>No passages available for this level yet.</p>
        </div>`;
      return;
    }
    container.innerHTML = passages.map((p, i) => `
      <div class="nz-reading-card" data-idx="${i}">
        <div class="nz-rc-top">
          <span class="nz-rc-level">${p.level}</span>
          <span class="nz-rc-topic">${p.topic}</span>
        </div>
        <h3 class="nz-rc-title">${p.title}</h3>
        <p class="nz-rc-preview">${p.passage[0].en}</p>
        <button class="nz-rc-btn" data-idx="${i}">Start Reading →</button>
      </div>`).join('');

    container.querySelectorAll('.nz-rc-btn').forEach(btn => {
      btn.addEventListener('click', () => openPassage(parseInt(btn.dataset.idx), container));
    });
  }

  // ── OPEN SINGLE PASSAGE ────────────────────────────────────────────────────
  function openPassage(idx, container) {
    currentPassage = passages[idx];
    currentQ = 0;
    score = 0;
    answered = false;
    container.innerHTML = renderPassageHTML(currentPassage);
    container.querySelector('#nz-start-quiz')
      ?.addEventListener('click', () => renderQuiz(container));
    container.querySelector('.nz-back-btn')
      ?.addEventListener('click', () => renderList(container));
  }

  function renderPassageHTML(p) {
    const lines = p.passage.map(line => `
      <div class="nz-passage-line">
        <div class="nz-line-jp">${line.furigana || line.jp}</div>
        <div class="nz-line-en">${line.en}</div>
      </div>`).join('');

    const vocab = p.vocabulary?.map(v => `
      <div class="nz-vocab-chip">
        <span class="nz-vc-jp">${v.jp}</span>
        <span class="nz-vc-en">${v.en}</span>
      </div>`).join('') || '';

    return `
      <div class="nz-passage-wrap">
        <button class="nz-back-btn">← Back to passages</button>
        <div class="nz-passage-header">
          <span class="nz-rc-level">${p.level}</span>
          <span class="nz-rc-topic">${p.topic}</span>
          <h2 class="nz-passage-title">${p.title}</h2>
        </div>
        <div class="nz-passage-body">${lines}</div>
        ${vocab ? `<div class="nz-vocab-section"><h4>Key Vocabulary</h4><div class="nz-vocab-chips">${vocab}</div></div>` : ''}
        <button class="nz-quiz-start-btn" id="nz-start-quiz">📝 Take Comprehension Quiz</button>
      </div>`;
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  function renderQuiz(container) {
    const questions = currentPassage.questions || [];
    if (!questions.length) {
      container.innerHTML += '<p style="text-align:center;padding:1rem">No questions available.</p>';
      return;
    }
    renderQuestion(container, questions);
  }

  function renderQuestion(container, questions) {
    if (currentQ >= questions.length) {
      renderResult(container, questions.length);
      return;
    }
    const q = questions[currentQ];
    container.innerHTML = `
      <div class="nz-quiz-wrap">
        <div class="nz-quiz-progress">
          Question ${currentQ + 1} / ${questions.length}
          <span class="nz-quiz-score">Score: ${score}</span>
        </div>
        <div class="nz-quiz-q">${q.q}</div>
        <div class="nz-quiz-opts">
          ${q.opts.map((opt, i) => `
            <button class="nz-quiz-opt" data-idx="${i}">${opt}</button>
          `).join('')}
        </div>
        <div class="nz-quiz-fb" id="nz-quiz-fb"></div>
      </div>`;

    container.querySelectorAll('.nz-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.dataset.idx);
        const correct = q.ans;
        const fb = container.querySelector('#nz-quiz-fb');
        if (chosen === correct) {
          btn.classList.add('correct');
          score++;
          fb.textContent = '✓ Correct!';
          fb.style.color = 'var(--l-green)';
        } else {
          btn.classList.add('wrong');
          container.querySelectorAll('.nz-quiz-opt')[correct].classList.add('correct');
          fb.textContent = `✗ Correct answer: ${q.opts[correct]}`;
          fb.style.color = 'var(--l-red)';
        }
        setTimeout(() => {
          currentQ++;
          answered = false;
          renderQuestion(container, questions);
        }, 1200);
      });
    });
  }

  function renderResult(container, total) {
    const pct = Math.round(score / total * 100);
    const msg = pct === 100 ? '🏆 Perfect!' : pct >= 70 ? '⭐ Well done!' : '📚 Keep studying!';
    container.innerHTML = `
      <div class="nz-result-wrap">
        <div class="nz-result-emoji">${pct >= 70 ? '🎉' : '📖'}</div>
        <h2 class="nz-result-title">${msg}</h2>
        <div class="nz-result-score">${score} / ${total}</div>
        <div class="nz-result-pct">${pct}% accuracy</div>
        <div class="nz-result-btns">
          <button class="nz-btn-retry">↺ Try Again</button>
          <button class="nz-btn-back">← All Passages</button>
        </div>
      </div>`;
    container.querySelector('.nz-btn-retry')
      ?.addEventListener('click', () => openPassage(passages.indexOf(currentPassage), container));
    container.querySelector('.nz-btn-back')
      ?.addEventListener('click', () => renderList(container));
  }

  // ── PUBLIC INIT ────────────────────────────────────────────────────────────
  async function init(containerEl, level) {
    currentLevel = level || 'n5';
    containerEl.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--l-text2)">
        <div style="font-size:1.5rem">Loading passages…</div>
      </div>`;
    await loadPassages(currentLevel);
    renderList(containerEl);
  }

  return { init, loadPassages, renderList };
})();

window.NZReading = NZReading;
