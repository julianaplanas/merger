/* Bistró — merge game de cocina, sin publicidad y con horario.
   Un solo archivo, sin dependencias. Estado en localStorage. */

(() => {
  'use strict';

  // ---------- Datos ----------
  const COLS = 7, ROWS = 9, MAX_LEVEL = 7;

  const CHAINS = {
    pan:    { name: 'Panadería', icon: '🥖', items: ['Harina', 'Masa', 'Pan', 'Baguette', 'Croissant', 'Tarta', 'Pastel'] },
    huerta: { name: 'Huerta',    icon: '🌱', items: ['Semilla', 'Brote', 'Tomate', 'Ensalada', 'Gazpacho', 'Ratatouille', 'Menú degustación'] },
    cafe:   { name: 'Café',      icon: '☕', items: ['Grano', 'Molido', 'Espresso', 'Latte', 'Capuchino', 'Affogato', 'Carta de cafés'] },
    dulce:  { name: 'Dulce',     icon: '🍬', items: ['Azúcar', 'Caramelo', 'Galleta', 'Brownie', 'Macaron', 'Tiramisú', 'Mesa dulce'] },
  };
  const CHAIN_KEYS = Object.keys(CHAINS);
  const GENERATORS = [[8, 0, 'pan'], [8, 2, 'huerta'], [8, 4, 'cafe'], [8, 6, 'dulce']]; // [fila, col, cadena]

  const DEFAULT_SETTINGS = {
    openHour: 8, closeHour: 19, days: [1, 2, 3, 4, 5], resetHour: 7,
    energy: 120, orders: 6,
    warnMin: 8, stopMin: 12, pauseMin: 20, idleSec: 60,
  };

  const DEV = ['localhost', '127.0.0.1'].includes(location.hostname);
  const STORAGE_KEY = 'bistro.v1';

  // ---------- Estado ----------
  let S = load();

  function emptyBoard() {
    const b = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    for (const [r, c, chain] of GENERATORS) b[r][c] = { gen: chain };
    return b;
  }

  function freshState() {
    return {
      board: emptyBoard(),
      energy: DEFAULT_SETTINGS.energy,
      orders: [],
      stars: 0,
      unlocked: 0,
      dayDone: false,
      lastReset: null,
      session: null,            // { startedAt, lastTouch }
      pausedUntil: 0,
      minutes: {},              // { 'YYYY-MM-DD': minutos }
      settings: { ...DEFAULT_SETTINGS },
      pendingSettings: null,
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}) };
        return s;
      }
    } catch (e) { /* estado corrupto: se empieza de cero */ }
    return freshState();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) { /* sin espacio: seguimos */ }
  }

  // ---------- Tiempo ----------
  const now = () => Date.now();

  // El "día de juego" empieza a la hora de reset, no a medianoche.
  function gameDay(t = now()) {
    const d = new Date(t - S.settings.resetHour * 3600 * 1000);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function maybeReset() {
    const today = gameDay();
    if (S.lastReset === today) return;
    if (S.pendingSettings) { S.settings = { ...S.settings, ...S.pendingSettings }; S.pendingSettings = null; }
    S.energy = S.settings.energy;
    S.orders = Array.from({ length: S.settings.orders }, makeOrder);
    S.dayDone = false;
    S.pausedUntil = 0;
    S.lastReset = today;
    save();
  }

  function isOpen(t = now()) {
    if (DEV) return true;
    const d = new Date(t);
    const h = d.getHours() + d.getMinutes() / 60;
    return S.settings.days.includes(d.getDay()) && h >= S.settings.openHour && h < S.settings.closeHour;
  }

  function nextOpening(t = now()) {
    const d = new Date(t);
    d.setSeconds(0, 0);
    for (let i = 0; i < 8; i++) {
      const cand = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, S.settings.openHour, 0, 0);
      if (S.settings.days.includes(cand.getDay()) && cand.getTime() > t) return cand;
    }
    return null;
  }

  function fmtOpening(d) {
    if (!d) return 'más adelante';
    const t = now();
    const sameDay = new Date(t).toDateString() === d.toDateString();
    const tomorrow = new Date(t + 86400000).toDateString() === d.toDateString();
    const hh = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (sameDay) return `hoy a las ${hh}`;
    if (tomorrow) return `mañana a las ${hh}`;
    const days = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
    return `${days[d.getDay()]} a las ${hh}`;
  }

  // ---------- Sesiones y contador ----------
  function endSession(t = now()) {
    if (!S.session) return;
    const ms = Math.min(t, S.session.lastTouch + S.settings.idleSec * 1000) - S.session.startedAt;
    const day = gameDay(S.session.startedAt);
    S.minutes[day] = (S.minutes[day] || 0) + ms / 60000;
    S.session = null;
    save();
  }

  function checkIdle() {
    if (S.session && now() - S.session.lastTouch > S.settings.idleSec * 1000) endSession();
  }

  // Se llama en cada acción del jugador. Devuelve false si la sesión acaba de cerrarse por tiempo.
  function touch() {
    const t = now();
    checkIdle();
    if (!S.session) S.session = { startedAt: t, lastTouch: t };
    S.session.lastTouch = t;
    const mins = (t - S.session.startedAt) / 60000;
    if (mins >= S.settings.stopMin) {
      S.pausedUntil = t + S.settings.pauseMin * 60000;
      endSession(t);
      return false;
    }
    return true;
  }

  function minutesToday() {
    const base = S.minutes[gameDay()] || 0;
    const live = S.session ? (now() - S.session.startedAt) / 60000 : 0;
    return base + live;
  }

  function minutesThisWeek() {
    const t = now();
    const d = new Date(t);
    const dow = (d.getDay() + 6) % 7; // lunes = 0
    let total = S.session ? (t - S.session.startedAt) / 60000 : 0;
    for (let i = 0; i <= dow; i++) total += S.minutes[gameDay(t - i * 86400000)] || 0;
    return total;
  }

  // ---------- Pedidos ----------
  function makeOrder() {
    const n = Math.random() < 0.6 ? 1 : 2;
    const items = Array.from({ length: n }, () => ({
      chain: CHAIN_KEYS[Math.floor(Math.random() * CHAIN_KEYS.length)],
      level: 3 + Math.floor(Math.random() * 4),
      done: false,
    }));
    return { items, done: false };
  }

  function deliver(orderIdx, r, c) {
    const it = S.board[r][c];
    const order = S.orders[orderIdx];
    if (!it || !order || order.done) return false;
    const need = order.items.find(x => !x.done && x.chain === it.chain && x.level === it.level);
    if (!need) return false;
    need.done = true;
    S.board[r][c] = null;
    if (order.items.every(x => x.done)) {
      order.done = true;
      S.stars++;
      if (S.orders.every(o => o.done)) {
        S.dayDone = true;
        // Piezas nuevas desde el último cierre: se anuncian en la pantalla de cierre, no en el tablero.
        const nowUnlocked = LOCAL.unlockedCount(S.stars);
        S.newPieces = LOCAL.pieces.slice(S.unlocked, nowUnlocked).map(p => p.name);
        S.unlocked = nowUnlocked;
        endSession();
      }
    }
    save();
    return true;
  }

  // ---------- Tablero ----------
  function nearestFree(r0, c0) {
    let best = null, bestD = Infinity;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (S.board[r][c]) continue;
      const d = Math.abs(r - r0) + Math.abs(c - c0) + (r > r0 ? 0.5 : 0);
      if (d < bestD) { bestD = d; best = [r, c]; }
    }
    return best;
  }

  function generate(r, c) {
    const g = S.board[r][c];
    if (!g || !g.gen) return;
    if (S.energy <= 0) { flash('Sin energía por hoy'); return; }
    const spot = nearestFree(r, c);
    if (!spot) { flash('Tablero lleno'); return; }
    S.energy--;
    S.board[spot[0]][spot[1]] = { chain: g.gen, level: Math.random() < 0.8 ? 1 : 2 };
    save();
  }

  function canMerge(a, b) {
    return a && b && !a.gen && !b.gen && a.chain === b.chain && a.level === b.level && a.level < MAX_LEVEL;
  }

  function moveOrMerge(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return;
    const a = S.board[r1][c1], b = S.board[r2][c2];
    if (!a || a.gen) return;
    if (!b) { S.board[r2][c2] = a; S.board[r1][c1] = null; }
    else if (canMerge(a, b)) { S.board[r2][c2] = { chain: a.chain, level: a.level + 1 }; S.board[r1][c1] = null; }
    else return;
    save();
  }

  function remove(r, c) {
    const it = S.board[r][c];
    if (!it || it.gen) return;
    S.board[r][c] = null;
    save();
  }

  // ---------- UI ----------
  const $ = id => document.getElementById(id);
  const app = $('app'), boardEl = $('board'), ordersEl = $('orders'), trashEl = $('trash');
  const noticeEl = $('notice'), overlay = $('overlay');
  let flashTimer = null;

  function flash(msg) {
    noticeEl.textContent = msg; noticeEl.hidden = false;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { noticeEl.hidden = true; }, 1500);
  }

  function itemEl(it, small) {
    const el = document.createElement('div');
    el.className = `item ${it.gen || it.chain}`;
    if (it.gen) { el.classList.add('gen'); el.textContent = CHAINS[it.gen].icon; if (S.energy <= 0) el.classList.add('empty'); }
    else { el.textContent = it.level; if (it.level === MAX_LEVEL) el.classList.add('max'); el.title = CHAINS[it.chain].items[it.level - 1]; }
    return el;
  }

  function wantedSet() {
    const w = new Set();
    for (const o of S.orders) if (!o.done) for (const x of o.items) if (!x.done) w.add(`${x.chain}:${x.level}`);
    return w;
  }

  function render() {
    const t = now();
    $('energy').textContent = `⚡ ${S.energy}`;
    $('stars').textContent = `★ ${S.stars}`;
    $('minutes').textContent = `${Math.round(minutesToday())} min hoy · ${Math.round(minutesThisWeek())} esta semana`;

    // Pedidos
    ordersEl.innerHTML = '';
    S.orders.forEach((o, i) => {
      const el = document.createElement('div');
      el.className = 'order' + (o.done ? ' done' : '');
      el.dataset.order = i;
      for (const x of o.items) {
        const ie = itemEl({ chain: x.chain, level: x.level }, true);
        if (x.done) ie.style.opacity = '.3';
        el.appendChild(ie);
      }
      ordersEl.appendChild(el);
    });

    // Tablero
    const wanted = wantedSet();
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell'; cell.dataset.r = r; cell.dataset.c = c;
      const it = S.board[r][c];
      if (it) {
        const el = itemEl(it);
        if (!it.gen && wanted.has(`${it.chain}:${it.level}`)) el.classList.add('wants');
        cell.appendChild(el);
      }
      boardEl.appendChild(cell);
    }

    // Bloqueos
    let lock = null;
    if (!isOpen(t)) lock = ['Cerrado', `Abrimos ${fmtOpening(nextOpening(t))}.`];
    else if (S.dayDone) {
      const np = S.newPieces || [];
      const extra = np.length ? ` Hay algo nuevo en el local: ${np.join(', ').toLowerCase()}.` : '';
      lock = ['Listo por hoy', `${S.stars} estrellas en total.${extra} Los próximos pedidos llegan ${fmtOpening(nextOpening(t))}.`];
    }
    else if (S.pausedUntil > t) {
      const m = Math.ceil((S.pausedUntil - t) / 60000);
      lock = ['Pausa', `Llevabas ${S.settings.stopMin} minutos seguidos. El tablero vuelve en ${m} min.`];
    }
    app.classList.toggle('locked', !!lock);
    overlay.hidden = !lock;
    if (lock) { $('overlay-title').textContent = lock[0]; $('overlay-text').textContent = lock[1]; }

    // Aviso de sesión larga
    if (!lock && S.session && (t - S.session.startedAt) / 60000 >= S.settings.warnMin) {
      noticeEl.textContent = `Llevás ${Math.floor((t - S.session.startedAt) / 60000)} minutos seguidos`;
      noticeEl.hidden = false;
    }
  }

  // ---------- Drag & drop ----------
  let drag = null; // { r, c, ghost, moved, startX, startY }

  function cellAt(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const cell = el.closest('.cell');
    if (cell) return { kind: 'cell', r: +cell.dataset.r, c: +cell.dataset.c, el: cell };
    const order = el.closest('.order');
    if (order) return { kind: 'order', i: +order.dataset.order, el: order };
    if (el.closest('#trash')) return { kind: 'trash', el: trashEl };
    return null;
  }

  function clearHighlights() {
    document.querySelectorAll('.cell.over, .order.target').forEach(e => e.classList.remove('over', 'target'));
    trashEl.classList.remove('over');
  }

  boardEl.addEventListener('pointerdown', e => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const r = +cell.dataset.r, c = +cell.dataset.c;
    const it = S.board[r][c];
    if (!it) return;
    e.preventDefault();
    drag = { r, c, it, moved: false, startX: e.clientX, startY: e.clientY, ghost: null, src: cell.firstChild };
    boardEl.setPointerCapture(e.pointerId);
  });

  boardEl.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 6) return;
      if (drag.it.gen) return; // los generadores no se arrastran
      drag.moved = true;
      drag.ghost = itemEl(drag.it);
      drag.ghost.classList.add('dragging');
      document.body.appendChild(drag.ghost);
      drag.src.classList.add('ghost');
      trashEl.classList.add('show');
    }
    drag.ghost.style.left = e.clientX + 'px';
    drag.ghost.style.top = e.clientY + 'px';
    clearHighlights();
    const hit = cellAt(e.clientX, e.clientY);
    if (!hit) return;
    if (hit.kind === 'cell' && !(hit.r === drag.r && hit.c === drag.c)) hit.el.classList.add('over');
    else if (hit.kind === 'order' && !S.orders[hit.i].done) hit.el.classList.add('target');
    else if (hit.kind === 'trash') hit.el.classList.add('over');
  });

  function endDrag(e) {
    if (!drag) return;
    const d = drag; drag = null;
    clearHighlights();
    trashEl.classList.remove('show');
    if (d.ghost) d.ghost.remove();
    d.src && d.src.classList.remove('ghost');

    if (!touch()) { render(); return; }

    if (!d.moved) {
      if (d.it.gen) generate(d.r, d.c);
    } else {
      const hit = cellAt(e.clientX, e.clientY);
      if (hit && hit.kind === 'cell') moveOrMerge(d.r, d.c, hit.r, hit.c);
      else if (hit && hit.kind === 'order') { if (!deliver(hit.i, d.r, d.c)) flash('Ese pedido no pide eso'); }
      else if (hit && hit.kind === 'trash') remove(d.r, d.c);
    }
    render();
  }
  boardEl.addEventListener('pointerup', endDrag);
  boardEl.addEventListener('pointercancel', endDrag);

  // ---------- El local ----------
  $('local-btn').addEventListener('click', () => {
    const { svg, caption } = LOCAL.render(S.stars);
    $('local-scene').innerHTML = svg;
    $('local-caption').textContent = caption;
    $('local').hidden = false;
  });
  $('local-close').addEventListener('click', () => { $('local').hidden = true; });

  // ---------- Ajustes ----------
  const FIELDS = [
    ['openHour', 'Hora de apertura'], ['closeHour', 'Hora de cierre'], ['days', 'Días (0=dom … 6=sáb)'],
    ['energy', 'Energía diaria'], ['orders', 'Pedidos por día'],
    ['warnMin', 'Aviso de sesión larga (min)'], ['stopMin', 'Cierre de sesión (min)'], ['pauseMin', 'Pausa entre sesiones (min)'],
  ];
  $('settings-btn').addEventListener('click', () => {
    const cur = { ...S.settings, ...(S.pendingSettings || {}) };
    const form = $('settings-form');
    form.innerHTML = '';
    for (const [k, label] of FIELDS) {
      const l = document.createElement('label');
      l.textContent = label;
      const inp = document.createElement('input');
      inp.name = k;
      inp.value = Array.isArray(cur[k]) ? cur[k].join(',') : cur[k];
      inp.inputMode = k === 'days' ? 'text' : 'numeric';
      l.appendChild(inp);
      form.appendChild(l);
    }
    $('settings').hidden = false;
  });
  $('settings-cancel').addEventListener('click', () => { $('settings').hidden = true; });
  $('settings-save').addEventListener('click', () => {
    const data = new FormData($('settings-form'));
    const p = {};
    for (const [k] of FIELDS) {
      const v = data.get(k).trim();
      p[k] = k === 'days' ? v.split(',').map(Number).filter(n => n >= 0 && n <= 6) : Number(v);
    }
    S.pendingSettings = p;
    save();
    $('settings').hidden = true;
    flash('Guardado. Aplica desde el próximo reset.');
  });

  // ---------- Arranque ----------
  maybeReset();
  render();
  setInterval(() => { checkIdle(); maybeReset(); render(); }, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkIdle(); maybeReset(); render(); } });

  if ('serviceWorker' in navigator && !DEV) navigator.serviceWorker.register('sw.js').catch(() => {});

  if (DEV) window.bistro = {
    S, save, render, generate, moveOrMerge, deliver, remove, touch, maybeReset, gameDay, isOpen, nextOpening,
    reset: () => { localStorage.removeItem(STORAGE_KEY); location.reload(); },
  };
})();
