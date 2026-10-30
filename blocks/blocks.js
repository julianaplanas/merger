/* Bloques — deslizá piezas de ladrillos hasta la salida de su color.
   Tablero de celdas; las piezas (poliominós) se arrastran y chocan entre sí y con los muros.
   En el borde hay salidas de color: una pieza sale cuando la empujás contra una salida de su color
   que cubre todo su lado. Nivel completo cuando no quedan piezas.
   Los niveles se construyen al revés (meter piezas por las salidas y deslizarlas hacia dentro),
   así que siempre tienen solución. */

(() => {
  'use strict';

  const KEY = 'blocks.v1';
  const COLORS = [
    ['#d9553f', '#a93a28'], ['#e4b45a', '#b8882c'], ['#7f9c6a', '#56713f'],
    ['#5a9bd6', '#2f6fa8'], ['#c97b8e', '#9a4e62'], ['#9c8bc4', '#6b5a95'],
  ];
  const SHAPES = {
    i1: [[0, 0]], i2: [[0, 0], [1, 0]], i2v: [[0, 0], [0, 1]], i3: [[0, 0], [1, 0], [2, 0]], i3v: [[0, 0], [0, 1], [0, 2]],
    o: [[0, 0], [1, 0], [0, 1], [1, 1]],
    l: [[0, 0], [0, 1], [1, 1]], lv: [[0, 0], [1, 0], [0, 1]], j: [[1, 0], [1, 1], [0, 1]], jv: [[0, 0], [1, 0], [1, 1]],
    t: [[0, 0], [1, 0], [2, 0], [1, 1]], tv: [[0, 0], [0, 1], [0, 2], [1, 1]],
    L3: [[0, 0], [0, 1], [0, 2], [1, 2]], L3v: [[0, 0], [1, 0], [2, 0], [0, 1]],
  };

  // ---------- Geometría ----------
  const cellsOf = p => p.shape.map(([x, y]) => [p.x + x, p.y + y]);
  const bbox = shape => { const xs = shape.map(c => c[0]), ys = shape.map(c => c[1]); return { w: Math.max(...xs) + 1, h: Math.max(...ys) + 1 }; };

  function occupied(L, except) {
    const occ = new Set();
    for (const w of L.walls) occ.add(w[0] + ',' + w[1]);
    for (const p of L.pieces) if (p !== except) for (const [x, y] of cellsOf(p)) occ.add(x + ',' + y);
    return occ;
  }
  function fits(L, p, nx, ny, occ) {
    for (const [sx, sy] of p.shape) {
      const x = nx + sx, y = ny + sy;
      if (x < 0 || y < 0 || x >= L.w || y >= L.h) return false;
      if (occ.has(x + ',' + y)) return false;
    }
    return true;
  }

  // ¿Puede salir la pieza por el lado `side` (si la empujamos un paso más)? Devuelve la salida o null.
  // side: 'N' | 'S' | 'W' | 'E'. Una salida = { side, color, from, len } (from..from+len-1 a lo largo del borde).
  function exitFor(L, p, side) {
    const cells = cellsOf(p);
    const { w, h } = bbox(p.shape);
    let edge, along;
    if (side === 'N') { if (p.y !== 0) return null; edge = cells.filter(c => c[1] === 0); along = edge.map(c => c[0]); }
    if (side === 'S') { if (p.y + h !== L.h) return null; edge = cells.filter(c => c[1] === L.h - 1); along = edge.map(c => c[0]); }
    if (side === 'W') { if (p.x !== 0) return null; edge = cells.filter(c => c[0] === 0); along = edge.map(c => c[1]); }
    if (side === 'E') { if (p.x + w !== L.w) return null; edge = cells.filter(c => c[0] === L.w - 1); along = edge.map(c => c[1]); }
    // toda la pieza debe poder atravesar: su extensión completa a lo largo del borde debe caber en la salida
    const span = side === 'N' || side === 'S' ? cells.map(c => c[0]) : cells.map(c => c[1]);
    const lo = Math.min(...span), hi = Math.max(...span);
    return L.exits.find(e => e.side === side && e.color === p.color && e.from <= lo && e.from + e.len - 1 >= hi) || null;
  }

  // ---------- Generación ----------
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }

  function spec(level) {
    const pieces = Math.min(14, 3 + Math.floor(level / 2));
    const colors = Math.min(COLORS.length, 2 + Math.floor(level / 4));
    const walls = Math.min(8, Math.floor(level / 3));
    const slides = 2 + Math.min(6, Math.floor(level / 3));
    const w = level < 8 ? 6 : 7, h = level < 8 ? 7 : 8;
    const bigShapes = level >= 5;
    return { pieces, colors, walls, slides, w, h, bigShapes };
  }

  function generate(level) {
    const sp = spec(level);
    for (let attempt = 0; attempt < 60; attempt++) {
      const L = { w: sp.w, h: sp.h, walls: [], pieces: [], exits: [], solution: [] };
      // salidas: una o dos por color, en lados variados
      const sides = ['N', 'S', 'W', 'E'];
      for (let c = 0; c < sp.colors; c++) {
        const n = 1 + (Math.random() < 0.35 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          const side = pick(sides);
          const max = side === 'N' || side === 'S' ? L.w : L.h;
          const len = 1 + rnd(3);
          const from = rnd(max - len + 1);
          if (L.exits.some(e => e.side === side && !(from + len <= e.from || e.from + e.len <= from))) { k--; if (Math.random() < 0.3) break; continue; }
          L.exits.push({ side, color: c, from, len });
        }
      }
      if (!L.exits.length) continue;
      // muros
      for (let i = 0; i < sp.walls; i++) {
        const x = 1 + rnd(L.w - 2), y = 1 + rnd(L.h - 2);
        if (!L.walls.some(w => w[0] === x && w[1] === y)) L.walls.push([x, y]);
      }
      // piezas: insertar por una salida y deslizar hacia dentro
      const shapeKeys = Object.keys(SHAPES).filter(k => sp.bigShapes || ['i1', 'i2', 'i2v', 'i3', 'i3v', 'o', 'l', 'lv', 'j', 'jv'].includes(k));
      let ok = true;
      for (let i = 0; i < sp.pieces; i++) {
        let placed = false;
        for (let t = 0; t < 40 && !placed; t++) {
          const e = pick(L.exits);
          const key = pick(shapeKeys);
          const shape = SHAPES[key];
          const { w, h } = bbox(shape);
          // posición pegada a la salida, dentro del tramo
          let x, y;
          if (e.side === 'N' || e.side === 'S') { if (w > e.len) continue; x = e.from + rnd(e.len - w + 1); y = e.side === 'N' ? 0 : L.h - h; }
          else { if (h > e.len) continue; y = e.from + rnd(e.len - h + 1); x = e.side === 'W' ? 0 : L.w - w; }
          const p = { id: i, shape, color: e.color, x, y, key };
          const occ = occupied(L, p);
          if (!fits(L, p, x, y, occ)) continue;
          const path = [[x, y]];
          // deslizar hacia dentro: primero alejándose de la salida, luego al azar
          const inward = e.side === 'N' ? [0, 1] : e.side === 'S' ? [0, -1] : e.side === 'W' ? [1, 0] : [-1, 0];
          const steps = 1 + rnd(sp.slides);
          for (let s = 0; s < steps; s++) {
            const dirs = s === 0 ? [inward] : [inward, [1, 0], [-1, 0], [0, 1], [0, -1]];
            const d = pick(dirs);
            if (fits(L, p, p.x + d[0], p.y + d[1], occ)) { p.x += d[0]; p.y += d[1]; path.push([p.x, p.y]); }
          }
          // no dejarla ya en posición de salir (sería trivial) salvo en niveles muy bajos
          if (level > 2 && exitFor(L, p, e.side)) { const d = inward; if (fits(L, p, p.x + d[0], p.y + d[1], occ)) { p.x += d[0]; p.y += d[1]; path.push([p.x, p.y]); } }
          L.pieces.push(p); placed = true;
          L.solution.unshift({ id: i, side: e.side, path: path.reverse() }); // para salir: recorrer path y empujar hacia `side`
        }
        if (!placed) { ok = false; break; }
      }
      if (!ok || L.pieces.length < Math.max(3, sp.pieces - 2)) continue;
      // quitar salidas sin piezas de su color (ruido) salvo una por color presente
      const used = new Set(L.pieces.map(p => p.color));
      L.exits = L.exits.filter(e => used.has(e.color));
      return L;
    }
    return generate(Math.max(1, level - 1));
  }

  // ---------- Estado ----------
  let S = load();
  function load() { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {} return { level: 1, L: null, start: null, history: [], moves: 0 }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const snap = L => JSON.parse(JSON.stringify(L));

  function startLevel(level) {
    S.level = level; S.L = generate(level); S.start = snap(S.L); S.history = []; S.moves = 0; save();
  }
  if (!S.L) startLevel(S.level);

  // ---------- Vista ----------
  const $ = id => document.getElementById(id);
  const boardEl = $('board'), frameEl = $('frame');
  let cellPx = 48;

  function layout() {
    const L = S.L;
    const maxW = Math.min(440, window.innerWidth - 24) - 2 * 18;   // margen para salidas
    const maxH = window.innerHeight - 230;
    cellPx = Math.floor(Math.min(maxW / L.w, maxH / L.h, 60));
    frameEl.style.setProperty('--cell', cellPx + 'px');
    frameEl.style.setProperty('--w', L.w);
    frameEl.style.setProperty('--h', L.h);
  }

  function studs(shape, color) {
    const [c1, c2] = COLORS[color];
    return shape.map(([x, y]) => `<div class="cell" style="--x:${x};--y:${y};background:${c1};--dark:${c2}"><i></i></div>`).join('');
  }

  function render() {
    const L = S.L;
    layout();
    $('level').textContent = `Nivel ${S.level}`;
    $('moves').textContent = `${S.moves} mov.`;
    $('left').textContent = `${L.pieces.length} piezas`;
    $('undo').disabled = !S.history.length;

    // salidas
    const ex = L.exits.map(e => {
      const [c1] = COLORS[e.color];
      const horiz = e.side === 'N' || e.side === 'S';
      const style = horiz
        ? `left:calc(${e.from} * var(--cell));width:calc(${e.len} * var(--cell));${e.side === 'N' ? 'top:-16px' : 'bottom:-16px'};background:${c1}`
        : `top:calc(${e.from} * var(--cell));height:calc(${e.len} * var(--cell));${e.side === 'W' ? 'left:-16px' : 'right:-16px'};background:${c1}`;
      return `<div class="exit ${e.side}" style="${style}"></div>`;
    }).join('');
    const walls = L.walls.map(([x, y]) => `<div class="wall" style="--x:${x};--y:${y}"></div>`).join('');
    const pieces = L.pieces.map(p => `<div class="piece" data-id="${p.id}" style="--x:${p.x};--y:${p.y}">${studs(p.shape, p.color)}</div>`).join('');
    boardEl.innerHTML = walls + pieces;
    $('exits').innerHTML = ex;
  }

  // ---------- Arrastre ----------
  let drag = null;
  boardEl.addEventListener('pointerdown', e => {
    const el = e.target.closest('.piece'); if (!el) return;
    if (!HUB.touch()) return;
    const p = S.L.pieces.find(q => q.id === +el.dataset.id); if (!p) return;
    e.preventDefault();
    drag = { p, el, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, before: snap(S.L), moved: false, occ: occupied(S.L, p) };
    el.classList.add('dragging');
    boardEl.setPointerCapture && boardEl.setPointerCapture(e.pointerId);
  });
  boardEl.addEventListener('pointermove', e => {
    if (!drag) return;
    const L = S.L, p = drag.p;
    // celda objetivo según el desplazamiento del dedo
    const tx = drag.ox + Math.round((e.clientX - drag.sx) / cellPx);
    const ty = drag.oy + Math.round((e.clientY - drag.sy) / cellPx);
    // avanzar paso a paso hacia el objetivo, eje por eje, sin atravesar nada
    let guard = 20;
    while (guard-- && (p.x !== tx || p.y !== ty)) {
      let stepped = false;
      const dx = Math.sign(tx - p.x), dy = Math.sign(ty - p.y);
      // probar primero el eje con más distancia pendiente
      const order = Math.abs(tx - p.x) >= Math.abs(ty - p.y) ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
      for (const [mx, my] of order) {
        if (!mx && !my) continue;
        if (fits(L, p, p.x + mx, p.y + my, drag.occ)) { p.x += mx; p.y += my; stepped = true; break; }
        // ¿empuja hacia una salida?
        const side = my < 0 ? 'N' : my > 0 ? 'S' : mx < 0 ? 'W' : 'E';
        const ex = exitFor(L, p, side);
        if (ex) { finishExit(p, side); return; }
      }
      if (!stepped) break;
    }
    if (p.x !== drag.ox || p.y !== drag.oy) drag.moved = true;
    drag.el.style.setProperty('--x', p.x); drag.el.style.setProperty('--y', p.y);
  });
  function endDrag() {
    if (!drag) return;
    const d = drag; drag = null;
    d.el.classList.remove('dragging');
    if (d.moved) { S.history.push(d.before); S.moves++; save(); }
    render();
  }
  boardEl.addEventListener('pointerup', endDrag);
  boardEl.addEventListener('pointercancel', endDrag);

  function finishExit(p, side) {
    const d = drag; drag = null;
    S.history.push(d.before); S.moves++;
    S.L.pieces = S.L.pieces.filter(q => q !== p);
    save();
    // animación de salida
    d.el.classList.remove('dragging'); d.el.classList.add('exit-' + side);
    setTimeout(() => {
      render();
      if (!S.L.pieces.length) onSolved();
    }, 220);
  }

  function undo() {
    if (!S.history.length || !HUB.touch()) return;
    S.L = S.history.pop(); S.moves++; save(); render();
  }
  function restart() { if (!HUB.touch()) return; S.L = snap(S.start); S.history = []; S.moves = 0; save(); render(); }
  $('undo').addEventListener('click', undo);
  $('restart').addEventListener('click', restart);

  function onSolved() {
    $('win-title').textContent = `¡Nivel ${S.level}!`;
    $('win-text').textContent = `${S.moves} movimientos.`;
    confetti(); $('win').hidden = false;
  }
  $('win-next').addEventListener('click', () => { $('win').hidden = true; startLevel(S.level + 1); render(); });

  function confetti() {
    const box = $('confetti'); box.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = (10 + Math.random() * 80) + '%'; p.style.background = COLORS[i % COLORS.length][0];
      p.style.animationDelay = (Math.random() * .3) + 's'; p.style.setProperty('--dx', (Math.random() * 2 - 1) * 120 + 'px');
      box.appendChild(p);
    }
    setTimeout(() => { box.innerHTML = ''; }, 1800);
  }

  function tickLock() {
    const lock = HUB.lock();
    $('lock').hidden = !lock;
    if (lock) { $('lock-title').textContent = lock[0]; $('lock-text').textContent = lock[1]; }
    $('status').textContent = HUB.warn() || '';
  }
  tickLock(); setInterval(tickLock, 10000);
  document.addEventListener('hub:settings', tickLock);
  window.addEventListener('resize', render);
  render();

  if (HUB.DEV) window.blocks = { S, generate, spec, fits, occupied, exitFor, startLevel, render, SHAPES, reset: () => { localStorage.removeItem(KEY); location.reload(); } };
})();
