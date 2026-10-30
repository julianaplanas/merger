/* Colores — ordenar bloques por color vertiendo entre tubos.
   Reglas: un tubo tiene capacidad 4. Se vierte el "tramo" superior (bloques iguales seguidos)
   a otro tubo si está vacío o su bloque superior es del mismo color, tantos como quepan.
   Los niveles se generan al azar y se verifican con un solver antes de mostrarse. */

(() => {
  'use strict';

  const CAP = 4;
  const PALETTE = [
    ['#c9643f', 'terracota'], ['#7f9c6a', 'oliva'], ['#e4b45a', 'mostaza'], ['#5d6b78', 'pizarra'],
    ['#c97b8e', 'rosa'], ['#8fa7b8', 'celeste'], ['#8b5e3c', 'café'], ['#d9553f', 'tomate'],
    ['#5a3b26', 'cacao'], ['#9c8bc4', 'lavanda'], ['#4f9a94', 'turquesa'], ['#e08a5c', 'melocotón'],
  ];
  const KEY = 'sort.v1';

  // ---------- Lógica ----------
  function topRun(tube) {
    if (!tube.length) return { color: null, n: 0 };
    const c = tube[tube.length - 1];
    let n = 0;
    for (let i = tube.length - 1; i >= 0 && tube[i] === c; i--) n++;
    return { color: c, n };
  }
  function isComplete(tube) { return tube.length === CAP && tube.every(x => x === tube[0]); }
  function canPour(tubes, a, b) {
    if (a === b) return 0;
    const A = tubes[a], B = tubes[b];
    if (!A.length || B.length === CAP) return 0;
    const { color, n } = topRun(A);
    if (B.length && B[B.length - 1] !== color) return 0;
    return Math.min(n, CAP - B.length);
  }
  function pour(tubes, a, b) {
    const n = canPour(tubes, a, b);
    if (!n) return 0;
    const moved = tubes[a].splice(tubes[a].length - n, n);
    tubes[b].push(...moved);
    return n;
  }
  function solved(tubes) { return tubes.every(t => !t.length || isComplete(t)); }
  const clone = t => t.map(x => x.slice());
  const keyOf = t => t.map(x => x.join('')).sort().join('|');

  // Solver DFS con memo. Devuelve true si tiene solución (límite de nodos para no colgar).
  function solvable(tubes, limit = 150000) {
    const seen = new Set();
    let nodes = 0;
    function dfs(t) {
      if (solved(t)) return true;
      if (++nodes > limit) return false;
      const k = keyOf(t); if (seen.has(k)) return false; seen.add(k);
      const moves = [];
      for (let a = 0; a < t.length; a++) {
        if (!t[a].length || isComplete(t[a])) continue;
        const ra = topRun(t[a]);
        for (let b = 0; b < t.length; b++) {
          if (a === b) continue;
          const n = canPour(t, a, b);
          if (!n) continue;
          // podas: no mover un tubo monocolor a uno vacío; no mover parte de un tramo a un tubo vacío si cabe entero en otro lado
          if (!t[b].length && ra.n === t[a].length) continue;
          moves.push([a, b, n, t[b].length ? 2 : 1]);
        }
      }
      moves.sort((x, y) => y[3] - x[3] || y[2] - x[2]);
      for (const [a, b] of moves) {
        const nt = clone(t); pour(nt, a, b);
        if (dfs(nt)) return true;
      }
      return false;
    }
    return dfs(clone(tubes));
  }

  // Generar nivel: colores según nivel, 2 tubos vacíos; barajar hasta que sea resoluble y no trivial.
  function levelSpec(level) {
    const colors = Math.min(10, 3 + Math.floor((level - 1) / 3));                        // 3,3,3,4,4,4,5… hasta 10
    const empties = level >= 6 && level % 7 === 0 && colors <= 8 ? 1 : 2;                  // de vez en cuando, un solo tubo vacío
    return { colors, empties };
  }
  function generate(level, rnd = Math.random) {
    const { colors, empties } = levelSpec(level);
    for (let tries = 0; tries < 200; tries++) {
      const blocks = [];
      for (let c = 0; c < colors; c++) for (let i = 0; i < CAP; i++) blocks.push(c);
      for (let i = blocks.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; }
      const tubes = [];
      for (let c = 0; c < colors; c++) tubes.push(blocks.slice(c * CAP, c * CAP + CAP));
      for (let e = 0; e < empties; e++) tubes.push([]);
      if (tubes.some(isComplete)) continue;            // nada regalado
      if (solvable(tubes)) return tubes;
    }
    // fallback imposible de alcanzar en la práctica: nivel con un tubo vacío más
    const t = generate(level - 1, rnd); t.push([]); return t;
  }

  // ---------- Estado ----------
  let S = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return { level: 1, tubes: null, history: [], moves: 0, best: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  function startLevel(level) {
    S.level = level;
    S.tubes = generate(level);
    S.start = S.tubes.map(t => t.slice());
    S.history = []; S.moves = 0;
    save();
  }
  if (!S.tubes) startLevel(S.level);
  if (!S.start) S.start = S.tubes.map(t => t.slice());

  // ---------- Vista ----------
  const $ = id => document.getElementById(id);
  const tubesEl = $('tubes'), levelEl = $('level'), movesEl = $('moves');
  let selected = null;     // índice de tubo seleccionado
  let busy = false;

  function tubeEl(tube, i) {
    const el = document.createElement('div');
    el.className = 'tube' + (selected === i ? ' selected' : '') + (isComplete(tube) ? ' complete' : '');
    el.dataset.i = i;
    const inner = document.createElement('div'); inner.className = 'glass';
    tube.forEach((c, j) => {
      const b = document.createElement('div'); b.className = 'block';
      b.style.background = PALETTE[c][0]; b.style.setProperty('--j', j);
      if (selected === i && j >= tube.length - topRun(tube).n) b.classList.add('lift');
      inner.appendChild(b);
    });
    el.appendChild(inner);
    return el;
  }

  function render() {
    levelEl.textContent = `Nivel ${S.level}`;
    movesEl.textContent = `${S.moves} mov.`;
    tubesEl.innerHTML = '';
    const n = S.tubes.length;
    tubesEl.style.setProperty('--n', n);
    tubesEl.classList.toggle('two-rows', n > 7);
    S.tubes.forEach((t, i) => tubesEl.appendChild(tubeEl(t, i)));
    $('undo').disabled = !S.history.length;
    $('status').textContent = '';
  }

  function onTube(i) {
    if (busy || !HUB.touch()) return;
    if (selected === null) {
      if (S.tubes[i].length && !isComplete(S.tubes[i])) selected = i;
      render(); return;
    }
    if (selected === i) { selected = null; render(); return; }
    const n = canPour(S.tubes, selected, i);
    if (!n) {
      // cambiar selección si el destino tiene bloques; si no, deseleccionar
      selected = S.tubes[i].length && !isComplete(S.tubes[i]) ? i : null;
      render(); return;
    }
    S.history.push({ a: selected, b: i, n });
    pour(S.tubes, selected, i);
    S.moves++;
    const from = selected; selected = null;
    save();
    animatePour(from, i, n);
  }

  function animatePour(a, b, n) {
    busy = true;
    render();
    const dst = tubesEl.children[b];
    const blocks = dst.querySelectorAll('.block');
    for (let k = blocks.length - n; k < blocks.length; k++) blocks[k].classList.add('drop');
    if (isComplete(S.tubes[b])) dst.classList.add('just-done');
    setTimeout(() => {
      busy = false;
      if (solved(S.tubes)) onSolved();
    }, 220);
  }

  function undo() {
    if (!S.history.length || !HUB.touch()) return;
    const m = S.history.pop();
    const moved = S.tubes[m.b].splice(S.tubes[m.b].length - m.n, m.n);
    S.tubes[m.a].push(...moved);
    S.moves++;
    selected = null; save(); render();
  }
  function restart() {
    if (busy || !HUB.touch()) return;
    S.tubes = S.start.map(t => t.slice()); S.history = []; S.moves = 0; selected = null; save(); render();
  }

  function onSolved() {
    const best = S.best[S.level];
    if (!best || S.moves < best) S.best[S.level] = S.moves;
    save();
    $('win-title').textContent = `¡Nivel ${S.level}!`;
    $('win-text').textContent = `${S.moves} movimientos${best && best < S.moves ? ` · tu mejor: ${best}` : best && best === S.moves ? '' : ' · nuevo récord'}.`;
    confetti();
    $('win').hidden = false;
  }
  $('win-next').addEventListener('click', () => { $('win').hidden = true; startLevel(S.level + 1); render(); });

  function confetti() {
    const box = $('confetti'); box.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.background = PALETTE[i % PALETTE.length][0];
      p.style.animationDelay = (Math.random() * .3) + 's';
      p.style.setProperty('--dx', (Math.random() * 2 - 1) * 120 + 'px');
      box.appendChild(p);
    }
    setTimeout(() => { box.innerHTML = ''; }, 1800);
  }

  tubesEl.addEventListener('pointerdown', e => {
    const t = e.target.closest('.tube'); if (!t) return;
    e.preventDefault();
    onTube(+t.dataset.i);
  });
  $('undo').addEventListener('click', undo);
  $('restart').addEventListener('click', restart);

  function tickLock() {
    const lock = HUB.lock();
    $('lock').hidden = !lock;
    if (lock) { $('lock-title').textContent = lock[0]; $('lock-text').textContent = lock[1]; }
    const w = HUB.warn(); $('status').textContent = w || '';
  }
  tickLock(); setInterval(tickLock, 10000);
  document.addEventListener('hub:settings', tickLock);

  render();

  if (HUB.DEV) window.sort = { S, generate, solvable, canPour, pour, solved, startLevel, render, levelSpec, reset: () => { localStorage.removeItem(KEY); location.reload(); } };
})();
