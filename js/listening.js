
/**
 * NihongoZen — Listening Module
 * Fetches from data/listening/{level}.json
 * Independent module — audio player UI ready for .mp3 files
 */

const NZListening = (() => {
  let currentLevel = 'n5';
  let dialogues = [];
  let currentDialogue = null;
  let currentQ = 0;
  let score = 0;
  let answered = false;
  let scriptVisible = false;
  let audioEl = null;

  // ── FETCH ──────────────────────────────────────────────────────────────────
  async function loadDialogues(level) {
    try {
      const res = await fetch(`data/listening/${level}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      dialogues = await res.json();
      return dialogues;
    } catch (e) {
      console.warn('Listening data load failed:', e);
      dialogues = [];
      return [];
    }
  }

  // ── RENDER DIALOGUE LIST ───────────────────────────────────────────────────
  function renderList(container) {
    if (!dialogues.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--l-text2)">
          <div style="font-size:2.5rem;margin-bottom:1rem">🎧</div>
          <p>No listening exercises available for this level yet.</p>
        </div>`;
      return;
    }
    container.innerHTML = dialogues.map((d, i) => `
      <div class="nz-listen-card" data-idx="${i}">
        <div class="nz-lc-top">
          <span class="nz-rc-level">${d.level}</span>
          <span class="nz-rc-topic">${d.topic}</span>
          <span class="nz-lc-lines">🎙️ ${d.script.length} lines</span>
        </div>
        <h3 class="nz-rc-title">${d.title}</h3>
        <p class="nz-rc-preview">${d.script[0].en}</p>
        <button class="nz-rc-btn" data-idx="${i}">🎧 Start Listening →</button>
      </div>`).join('');

    container.querySelectorAll('.nz-rc-btn').forEach(btn => {
      btn.addEventListener('click', () => openDialogue(parseInt(btn.dataset.idx), container));
    });
  }

  // ── OPEN SINGLE DIALOGUE ───────────────────────────────────────────────────
  function openDialogue(idx, container) {
    currentDialogue = dialogues[idx];
    currentQ = 0;
    score = 0;
    answered = false;
    scriptVisible = false;
    container.innerHTML = renderDialogueHTML(currentDialogue);
    wireDialogueEvents(container);
  }

  function renderDialogueHTML(d) {
    const scriptLines = d.script.map(line => `
      <div class="nz-script-line">
        <span class="nz-script-speaker">${line.speaker}</span>
        <div class="nz-script-text">
          <div class="nz-script-jp">${line.jp}</div>
          <div class="nz-script-en">${line.en}</div>
        </div>
      </div>`).join('');

    const phrases = d.key_phrases?.map(p => `
      <div class="nz-phrase-chip">
        <span class="nz-vc-jp">${p.jp}</span>
        <span class="nz-vc-en">${p.en}</span>
      </div>`).join('') || '';

    return `
      <div class="nz-listen-wrap">
        <button class="nz-back-btn" id="nz-back">← Back to dialogues</button>
        <div class="nz-passage-header">
          <span class="nz-rc-level">${d.level}</span>
          <span class="nz-rc-topic">${d.topic}</span>
          <h2 class="nz-passage-title">${d.title}</h2>
        </div>

        <!-- AUDIO PLAYER -->
        <div class="nz-audio-player">
          <div class="nz-audio-icon">🎵</div>
          <div class="nz-audio-info">
            <div class="nz-audio-title">${d.title}</div>
            <div class="nz-audio-sub">Japanese Conversation • ${d.level}</div>
          </div>
          <div class="nz-audio-controls">
            <button class="nz-audio-btn" id="nz-play-btn" title="Play/Pause">▶</button>
            <button class="nz-audio-btn" id="nz-replay-btn" title="Replay">↺</button>
          </div>
          <audio id="nz-audio-el" src="${d.audio}" preload="none"></audio>
          <div class="nz-audio-note">🎧 Audio file: ${d.audio}</div>
        </div>

        <!-- SCRIPT TOGGLE -->
        <button class="nz-script-toggle" id="nz-script-toggle">
          👁️ Show Script
        </button>
        <div class="nz-script-wrap" id="nz-script-wrap" style="display:none">
          ${scriptLines}
        </div>

        ${phrases ? `<div class="nz-vocab-section"><h4>Key Phrases</h4><div class="nz-vocab-chips">${phrases}</div></div>` : ''}

        <button class="nz-quiz-start-btn" id="nz-start-quiz">📝 Take Comprehension Quiz</button>
      </div>`;
  }

  function wireDialogueEvents(container) {
    // Back button
    container.querySelector('#nz-back')
      ?.addEventListener('click', () => {
        if (audioEl) { audioEl.pause(); audioEl = null; }
        renderList(container);
      });

    // Audio
    audioEl = container.querySelector('#nz-audio-el');
    container.querySelector('#nz-play-btn')?.addEventListener('click', () => {
      if (!audioEl) return;
      if (audioEl.paused) {
        audioEl.play().catch(() => showAudioNote(container));
        container.querySelector('#nz-play-btn').textContent = '⏸';
      } else {
        audioEl.pause();
        container.querySelector('#nz-play-btn').textContent = '▶';
      }
    });
    audioEl?.addEventListener('ended', () => {
      container.querySelector('#nz-play-btn').textContent = '▶';
    });
    container.querySelector('#nz-replay-btn')?.addEventListener('click', () => {
      if (!audioEl) return;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => showAudioNote(container));
      container.querySelector('#nz-play-btn').textContent = '⏸';
    });

    // Script toggle
    container.querySelector('#nz-script-toggle')?.addEventListener('click', () => {
      scriptVisible = !scriptVisible;
      const wrap = container.querySelector('#nz-script-wrap');
      const btn  = container.querySelector('#nz-script-toggle');
      wrap.style.display = scriptVisible ? 'block' : 'none';
      btn.textContent = scriptVisible ? '🙈 Hide Script' : '👁️ Show Script';
    });

    // Quiz
    container.querySelector('#nz-start-quiz')
      ?.addEventListener('click', () => renderQuiz(container));
  }

  function showAudioNote(container) {
    const note = container.querySelector('.nz-audio-note');
    if (note) {
      note.textContent = '⚠️ Audio file not found. Add .mp3 files to the audio/ folder.';
      note.style.color = 'var(--l-amber)';
    }
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  function renderQuiz(container) {
    const questions = currentDialogue.questions || [];
    if (!questions.length) return;
    if (audioEl) audioEl.pause();
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
            <button class="nz-quiz-opt" data-idx="${i}">${opt}</button>`).join('')}
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
          fb.textContent = `✗ Correct: ${q.opts[correct]}`;
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
    const msg = pct === 100 ? '🏆 Perfect!' : pct >= 70 ? '⭐ Great listening!' : '📚 Keep practising!';
    container.innerHTML = `
      <div class="nz-result-wrap">
        <div class="nz-result-emoji">${pct >= 70 ? '🎉' : '🎧'}</div>
        <h2 class="nz-result-title">${msg}</h2>
        <div class="nz-result-score">${score} / ${total}</div>
        <div class="nz-result-pct">${pct}% accuracy</div>
        <div class="nz-result-btns">
          <button class="nz-btn-retry">↺ Try Again</button>
          <button class="nz-btn-back">← All Dialogues</button>
        </div>
      </div>`;
    container.querySelector('.nz-btn-retry')
      ?.addEventListener('click', () => openDialogue(dialogues.indexOf(currentDialogue), container));
    container.querySelector('.nz-btn-back')
      ?.addEventListener('click', () => renderList(container));
  }

  // ── PUBLIC INIT ────────────────────────────────────────────────────────────
  async function init(containerEl, level) {
    currentLevel = level || 'n5';
    containerEl.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--l-text2)">
        <div style="font-size:1.5rem">Loading dialogues…</div>
      </div>`;
    await loadDialogues(currentLevel);
    renderList(containerEl);
  }

  return { init, loadDialogues, renderList };
})();

window.NZListening = NZListening;
