// =====================
// Helpers
// =====================
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

// =====================
// Intro: Falling Letters
// =====================
(function fallingIntro(){
  const intro = $('#intro');
  const heading = $('#introText');
  const skip = $('#skipIntro');

  if (!intro || !heading) return;

  // Split text into spans and randomize timing/rotation

const text = heading.dataset.text || heading.textContent.trim();
heading.textContent = ''; // clear
const letters = [];
for (const ch of text) {
  if (ch === ' ') {
    const gap = document.createElement('span');
    gap.className = 'intro-space';
    gap.innerHTML = '&nbsp;';      // real space that stays visible
    heading.appendChild(gap);
    continue;                      // don't animate spaces
  }
  const span = document.createElement('span');
  span.className = 'intro-letter';
  span.textContent = ch;
  span.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's';
  span.style.setProperty('--rot', (Math.random()*30 - 15).toFixed(1) + 'deg');
  heading.appendChild(span);
  letters.push(span);
}
  function finishIntro(){
    intro.classList.add('fade-out');
    setTimeout(()=> intro.remove(), 520);
    // celebratory white confetti to match SDG 4 styling
    try { burst(80); } catch(_) {}
  }

  // When the last letter finishes, fade the intro out
  let done = 0;
  letters.forEach(l => l.addEventListener('animationend', () => {
    done++;
    if (done === letters.length) finishIntro();
  }, { once: true }));

  // Allow skip
  skip?.addEventListener('click', finishIntro);

  // Safety timeout (in case animations are canceled)
  setTimeout(()=> { if (document.body.contains(intro)) finishIntro(); }, 3000);
})();

// =====================
// Confetti (white to match SDG 4)
// =====================
const canvas = $('#confetti');
const ctx = canvas?.getContext('2d');
let pieces = [];
function sizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();

function burst(n = 60) {
  if (!ctx || !canvas) return;
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: canvas.width / 2, y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 6, vy: Math.random() * -6 - 2,
      w: Math.random() * 20 + 10, h: Math.random() * 6 + 2,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
      color: '#fff'
    });
  }
}
(function loop() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.vy = (p.vy ?? 0) + 0.15; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  pieces = pieces.filter(p => p.y < canvas.height + 20);
  requestAnimationFrame(loop);
})();
// =====================
// SDG 4 Trivia (self-contained)
// =====================
const TRIVIA = [
  {
    t: "SDG 4 aims to ensure that all girls and boys complete free, equitable and quality primary and secondary education by 2030.",
    url: "https://sdgs.un.org/goals/goal4"
  },
  {
    t: "Globally, reading proficiency among 10-year-olds dropped sharply after the pandemic, highlighting the need for remedial learning.",
    url: "https://www.unesco.org/en/articles/100-million-more-children-under-minimum-reading-proficiency-level-due-covid-19-unesco-convenes-world"
  },
  {
    t: "Affordable access to textbooks can increase student learning by as much as one school year in low-resource settings.",
    url: "https://www.worldbank.org/en/topic/education"
  },
  {
    t: "Teacher shortages are a critical barrier: millions of new teachers are needed worldwide to reach universal primary and secondary education.",
    url: "https://www.unesco.org/en/articles/global-report-teachers-what-you-need-know"
  },
  {
    t: "Safe, inclusive, and accessible learning environments significantly improve attendance—especially for girls and learners with disabilities.",
    url: "https://sdgs.un.org/goals/goal4"
  }
];

(function initTrivia(){
  const el = {
    text: document.getElementById('triviaText'),
    idx:  document.getElementById('triviaIndex'),
    total:document.getElementById('triviaTotal'),
    next: document.getElementById('nextTrivia'),
    reveal: document.getElementById('revealSource'),
    link: document.getElementById('triviaLink')
  };
  if (!el.text) return; // section not on page

  let order = shuffle([...TRIVIA.keys()]);
  let i = 0;

  el.total.textContent = TRIVIA.length;
  show(i);

  el.next.addEventListener('click', () => {
    i = (i + 1) % order.length;
    if (i === 0) order = shuffle(order); // reshuffle each cycle
    show(i, true);
  });

  el.reveal.addEventListener('click', () => {
    const cur = TRIVIA[order[i]];
    el.link.href = cur.url;
    el.link.style.display = 'inline-block';
  });

  function show(idx, animate=false){
    const cur = TRIVIA[order[idx]];
    el.text.textContent = cur.t;
    el.idx.textContent = idx + 1;
    el.link.style.display = 'none'; // hide until revealed
    if (animate) {
      el.text.style.opacity = 0;
      requestAnimationFrame(() => {
        el.text.style.transition = 'opacity .25s ease, transform .25s ease';
        el.text.style.transform = 'translateY(-3px)';
        el.text.style.opacity = 1;
        setTimeout(() => { el.text.style.transform = 'none'; }, 260);
      });
    }
  }

  function shuffle(arr){
    for (let j = arr.length - 1; j > 0; j--){
      const k = Math.floor(Math.random() * (j + 1));
      [arr[j], arr[k]] = [arr[k], arr[j]];
    }
    return arr;
  }
})();


// =====================
// Quiz
// =====================
const QUESTIONS = [
  { q: 'What is the core aim of SDG 4?', choices: ['End hunger', 'Quality education for all'], a: 1 },
  { q: 'Target year for the SDGs?', choices: ['2030', '2050'], a: 0 },
  { q: 'Which action helps SDG 4 locally?', choices: ['Share open resources', 'Discourage reading'], a: 0 }
];
let qIdx = 0, score = 0, selected = null;

function renderQ() {
  const q = QUESTIONS[qIdx];
  $('#question').textContent = `Q${qIdx + 1}. ${q.q}`;
  const box = $('#choices'); box.innerHTML = '';
  q.choices.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.role = 'radio'; btn.setAttribute('aria-checked', 'false');
    btn.textContent = text;
    btn.onclick = () => { select(i, btn); check(); };
    box.appendChild(btn);
  });
  $('#feedback').textContent = '';
  updateProgress();
  selected = null;
}
function select(i, btn) {
  $$('.choice').forEach(el => el.setAttribute('aria-checked', 'false'));
  btn.setAttribute('aria-checked', 'true');
  selected = i;
}
function check() {
  if (selected === null) return;
  const correct = QUESTIONS[qIdx].a === selected;
  $('#feedback').textContent = correct ? 'Correct! 🎉' : 'Not quite — keep going!';
  if (correct) { score++; burst(50); }
  qIdx++;
  setTimeout(() => { (qIdx < QUESTIONS.length) ? renderQ() : finishQuiz(); }, 450);
}
function finishQuiz() {
  $('#question').textContent = `You scored ${score}/${QUESTIONS.length}!`;
  $('#choices').innerHTML = ''; $('#feedback').textContent = 'Great job!';
  $('#progressBar').style.width = '100%';
}
function updateProgress() {
  const p = Math.min(1, qIdx / QUESTIONS.length);
  $('#progressBar').style.width = `${p * 100}%`;
}
$('#nextBtn').onclick = renderQ;
renderQ();

// =====================
// Match Challenge (auto-reset + animations + manual reset)
// =====================
const PAIRS = [
  { barrier: 'No internet access',        solution: 'Open digital resources' },
  { barrier: 'Unsafe school environment', solution: 'Safe, inclusive facilities' },
  { barrier: 'Teacher shortages',         solution: 'Teacher training & hiring' },
  { barrier: 'Cost of textbooks',         solution: 'Scholarships & libraries' },
];

const barrierBox = $('#barriers');
const solutionBox = $('#solutions');
const resetBtn = $('#resetMatch');
let picked = null;

function renderMatch() {
  barrierBox.innerHTML = '';
  solutionBox.innerHTML = '';
  picked = null;

  // Shuffle barriers for variety
  const shuffled = [...PAIRS].sort(() => Math.random() - 0.5);

  // Barriers
  shuffled.forEach(({ barrier }) => {
    const b = document.createElement('div');
    b.className = 'badge';
    b.textContent = barrier;
    b.draggable = true;
    b.dataset.barrier = barrier;
    b.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', barrier);
      e.dataTransfer.effectAllowed = 'move';
    });
    b.tabIndex = 0;
    b.addEventListener('keydown', e => {
      if (e.key === 'Enter') { picked = (picked === b ? null : b); outlinePicked(); }
    });
    barrierBox.appendChild(b);
  });

  // Solutions (fixed order for clarity)
  PAIRS.forEach(({ barrier, solution }) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.accept = barrier;
    slot.style.position = 'relative';
    slot.innerHTML = `<h4>${solution}</h4><div class="dropzone"></div>`;
    slot.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    slot.addEventListener('drop', onDrop);
    slot.tabIndex = 0;
    slot.addEventListener('keydown', e => {
      if (e.key === 'Enter' && picked) tryPlace(picked.dataset.barrier, slot);
    });
    solutionBox.appendChild(slot);
  });
}
function outlinePicked() {
  $$('.badge').forEach(x => x.style.outline = '');
  if (picked) picked.style.outline = '2px solid #fff';
}
function onDrop(e) {
  e.preventDefault();
  const name = e.dataTransfer.getData('text/plain');
  tryPlace(name, e.currentTarget);
}
function tryPlace(barrierName, slot) {
  if (slot.classList.contains('good')) return;

  if (barrierName === slot.dataset.accept) {
    // Correct
    const badge = $(`.badge[data-barrier="${cssEscape(barrierName)}"]`);
    if (badge) {
      badge.draggable = false;
      badge.style.cursor = 'default';
      badge.style.opacity = .75;
      badge.style.outline = '';
    }
    slot.classList.remove('wrong');
    slot.classList.add('good');
    slot.querySelector('.dropzone').textContent = barrierName;
    burst(40);
    addAchievement(`Matched: ${barrierName}`);
    picked = null; outlinePicked();

    if ($$('.slot.good').length === PAIRS.length) showSuccessAndReset();
  } else {
    // Wrong -> shake
    slot.classList.remove('good');
    slot.classList.add('wrong');
    setTimeout(() => slot.classList.remove('wrong'), 320);
  }
}
function showSuccessAndReset() {
  burst(80);
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  overlay.textContent = 'Great job! New round…';
  solutionBox.style.position = 'relative';
  solutionBox.appendChild(overlay);
  setTimeout(() => { overlay.remove(); renderMatch(); }, 1600);
}
function cssEscape(s) { return s.replace(/["\\]/g, '\\$&'); }
resetBtn?.addEventListener('click', renderMatch);
renderMatch();

// =====================
// Stats + Streak
// =====================
function animateCounter(el, to, dur = 2000) {
  const start = +el.textContent || 0;
  const diff = to - start;
  const startTime = performance.now();

  function update(t) {
    const progress = Math.min(1, (t - startTime) / dur);
    el.textContent = Math.floor(start + diff * progress).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Approximate data
const totalStudents = 1280000000; // 1.28B students worldwide
const studyingPerMinute = 500000; // ~500k students studying per minute

// Animate the first two stats
animateCounter(document.getElementById('stat1'), totalStudents);
animateCounter(document.getElementById('stat2'), studyingPerMinute);

// Track days promoting quality education
(function updatePromotingDays() {
  const today = new Date().toDateString();
  const streakData = JSON.parse(localStorage.getItem('streak') || '{"last":null,"count":0}');
  if (streakData.last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streakData.count = (streakData.last === yesterday) ? (streakData.count + 1) : 1;
    streakData.last = today;
    localStorage.setItem('streak', JSON.stringify(streakData));
  }
  document.getElementById('streak').textContent = streakData.count;
})();

// =====================
// Pledge + Achievements
// =====================
const pledge = $('#pledge');
const saved = localStorage.getItem('pledge'); if (saved) pledge.value = saved;
$('#savePledge').onclick = () => { localStorage.setItem('pledge', pledge.value.trim()); addAchievement('Pledge saved'); burst(40); };
$('#clearPledge').onclick = () => { pledge.value = ''; localStorage.removeItem('pledge'); $('#achievements').innerHTML = ''; };
function addAchievement(text) { const li = document.createElement('li'); li.textContent = `🏅 ${text}`; $('#achievements').appendChild(li); }
$('#pledgeBtn').onclick = () => $('#plan').scrollIntoView({ behavior: 'smooth' });
$('#startQuizBtn').onclick = () => $('#quiz').scrollIntoView({ behavior: 'smooth' });
