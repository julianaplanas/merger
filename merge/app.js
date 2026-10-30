/* Bistró — merge game de cocina, sin publicidad y con horario.
   v2: ingredientes + estaciones + recetas. Contenido en data.js; iconos en icons.js; escena en local.js. */

(() => {
  'use strict';

  const { CHAINS, LEVELS, STATIONS, DISHES, UNLOCKS, GEN_POS, STATION_POS } = DATA;
  // Fondo claro de la casilla según la familia del plato (el borde lleva el color pleno).
  const DISH_BG = { '#c9643f': '#f6dcd2', '#7f9c6a': '#dfe8d6', '#c97b8e': '#f3dde3', '#e4b45a': '#f8ecd2', '#8b5e3c': '#eadbcf', '#5d6b78': '#dfe4e8', '#5a3b26': '#f6efe3' };

  const DEFAULT_SETTINGS = {
    openHour: 8, closeHour: 19, days: [1, 2, 3, 4, 5], resetHour: 7,
    energy: 120, orders: 4,
    warnMin: 8, stopMin: 12, pauseMin: 20, idleSec: 60,
  };

  const DEV = ['localhost', '127.0.0.1'].includes(location.hostname);
  const STORAGE_KEY = 'bistro.v2';
  const OLD_KEY = 'bistro.v1';

  // ---------- Celdas ----------
  // Una celda contiene null o uno de:
  //   { id: 'pan2' }                                 ingrediente (cadena+nivel) o plato (id de DISHES)
  //   { gen: 'pan' }                                 generador
  //   { station: 'horno', slots: ['pan2', null, …] } estación con ingredientes puestos
  //   { id: 'pizza', big: true }                     plato grande (dos iguales fusionados)

  // ---------- Estado ----------
  let S = load();
  let ROWS = 8, COLS = 6;

  function freshState() {
    return {
      board: Array.from({ length: 8 }, () => Array(6).fill(null)),
      wide: false,
      energy: DEFAULT_SETTINGS.energy,
      orders: [],
      stars: 0,
      unlockedIdx: 0,             // cuántas entradas de UNLOCKS están aplicadas
      discovered: [],             // ids de platos hechos al menos una vez
      dayDone: false,
      lastReset: null,
      session: null,
      pausedUntil: 0,
      minutes: {},
      settings: { ...DEFAULT_SETTINGS },
      pendingSettings: null,
      newUnlocks: [],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}) };
        if (s.board.length === 9 && !s.wide) { // tablero de la primera v2 (7×9): se reinicia a 6×8
          s.board = Array.from({ length: 8 }, () => Array(6).fill(null)); s.unlockedIdx = 0;
        }
        return s;
      }
      // Migración desde v1: se conservan estrellas, minutos y ajustes; el tablero se reinicia.
      const old = localStorage.getItem(OLD_KEY);
      if (old) {
        const o = JSON.parse(old);
        const s = freshState();
        s.stars = o.stars || 0; s.minutes = o.minutes || {}; s.lastReset = o.lastReset || null;
        s.settings = { ...DEFAULT_SETTINGS, ...(o.settings || {}) }; s.pendingSettings = o.pendingSettings || null;
        s.energy = o.energy ?? s.energy; s.dayDone = false;
        return s;
      }
    } catch (e) { /* estado corrupto: se empieza de cero */ }
    return freshState();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) { /* sin espacio: seguimos */ }
  }

  // ---------- Desbloqueos ----------
  const pendingCards = []; // desbloqueos por mostrar en tarjeta

  function applyUnlocks(announce) {
    const news = [], cards = [];
    while (S.unlockedIdx < UNLOCKS.length && UNLOCKS[S.unlockedIdx].stars <= S.stars) {
      const u = UNLOCKS[S.unlockedIdx++];
      cards.push(u);
      if (u.kind === 'gen') { place({ gen: u.id }, GEN_POS[u.id]); news.push(`generador de ${CHAINS[u.id].name.toLowerCase()}`); }
      else if (u.kind === 'station') { place({ station: u.id, slots: Array(STATIONS[u.id].slots).fill(null) }, STATION_POS[u.id]); news.push(`${STATIONS[u.id].name.toLowerCase()}`); }
      else if (u.kind === 'deco') { news.push(`${LOCAL.pieces[u.id].name.toLowerCase()} en el local`); }
      else if (u.kind === 'board') { widen(); news.push('tablero más grande'); }
    }
    if (announce && news.length) { S.newUnlocks = (S.newUnlocks || []).concat(news); pendingCards.push(...cards); }
    return news;
  }

  function place(cell, [r, c]) {
    if (S.board[r][c] && (S.board[r][c].gen || S.board[r][c].station)) return;
    if (S.board[r][c]) { const spot = nearestFree(r, c); if (spot) S.board[spot[0]][spot[1]] = S.board[r][c]; }
    S.board[r][c] = cell;
  }

  function widen() {
    if (S.wide) return;
    S.wide = true;
    const nb = Array.from({ length: 9 }, () => Array(7).fill(null));
    for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) nb[r][c] = S.board[r][c];
    // generadores de las filas 6–7 bajan a 7–8
    for (let c = 0; c < 6; c++) for (const r of [7, 6]) if (nb[r][c] && nb[r][c].gen) { nb[r + 1][c] = nb[r][c]; nb[r][c] = null; }
    S.board = nb;
    syncSize();
  }

  function syncSize() {
    ROWS = S.board.length; COLS = S.board[0].length;
    document.documentElement.style.setProperty('--cols', COLS);
  }

  function unlockName(u) {
    if (u.kind === 'gen') return `generador de ${CHAINS[u.id].name.toLowerCase()}`;
    if (u.kind === 'station') return STATIONS[u.id].name.toLowerCase();
    if (u.kind === 'deco') return LOCAL.pieces[u.id].name.toLowerCase();
    return 'tablero más grande';
  }

  function unlockedGens() { return UNLOCKS.slice(0, S.unlockedIdx).filter(u => u.kind === 'gen').map(u => u.id); }
  function unlockedStations() { return UNLOCKS.slice(0, S.unlockedIdx).filter(u => u.kind === 'station').map(u => u.id); }
  function decoCount() { return UNLOCKS.slice(0, S.unlockedIdx).filter(u => u.kind === 'deco').length; }

  // Un plato es "hacible" si todas sus estaciones y generadores están desbloqueados.
  function makeable(id) {
    const g = unlockedGens(), st = unlockedStations();
    return [...DATA.gensFor(id)].every(x => g.includes(x)) && [...DATA.stationsFor(id)].every(x => st.includes(x));
  }
  function availableDishes() { return Object.keys(DISHES).filter(makeable); }

  // ---------- Tiempo ----------
  const now = () => Date.now();

  function gameDay(t = now()) {
    const d = new Date(t - S.settings.resetHour * 3600 * 1000);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function maybeReset() {
    const today = gameDay();
    if (S.lastReset === today && S.orders.length) return;
    if (S.pendingSettings) { S.settings = { ...S.settings, ...S.pendingSettings }; S.pendingSettings = null; }
    S.energy = S.settings.energy;
    S.orders = makeOrders(S.settings.orders);
    S.delivered = 0;
    S.tables = 0;
    S.dayDone = false;
    S.pausedUntil = 0;
    S.lastReset = today;
    S.newUnlocks = [];
    save();
  }

  // Horario, sesiones y minutos: los lleva HUB (common.js). Aquí solo delegamos.
  const isOpen = () => !HUB.lock() || HUB.lock()[0] !== 'Cerrado';
  const nextOpening = (t) => HUB.nextOpening(t);
  const fmtOpening = (d) => HUB.fmtOpening(d);
  const touch = () => HUB.touch();
  const endSession = () => HUB.endSession();

  // ---------- Pedidos ----------
  // Siempre hay `orders` pedidos abiertos; al entregar uno llega otro. El día termina cuando se acaba la energía.
  // Un pedido pide 1–3 platos. Su costo apunta a una fracción de la energía diaria para que un día entero
  // equivalga a gastar toda la energía, ni más ni menos.
  function pickDish(sorted, orders, maxCost) {
    const count = x => orders.reduce((n, o) => n + o.items.filter(y => y.id === x).length, 0);
    let pool = sorted.filter(x => DATA.cost(x) <= maxCost && count(x) < 2);
    if (!pool.length) pool = sorted.filter(x => DATA.cost(x) <= maxCost);
    if (!pool.length) pool = [sorted[0]];
    // sesgo hacia lo caro dentro del límite: así los pedidos no son siempre lo más trivial
    const i = Math.floor(Math.pow(Math.random(), 0.6) * pool.length);
    return pool[Math.min(pool.length - 1, i)];
  }

  const NAMES = ['Lucía', 'Mateo', 'Sofía', 'Martín', 'Valentina', 'Hugo', 'Emma', 'Lucas', 'Olivia', 'Leo', 'Julia', 'Pablo', 'Martina', 'Daniel',
    'Carla', 'Álvaro', 'Noa', 'Adrián', 'Vera', 'Bruno', 'Alma', 'Iker', 'Chloe', 'Nico', 'Lola', 'Enzo', 'Jimena', 'Teo', 'Candela', 'Gael'];
  const FACES = ['🙂', '😊', '😄', '🧐', '😌', '🤓', '😎', '🥰', '😇', '🙃', '🤗', '😋'];
  function makeCustomer(orders) {
    const used = new Set(orders.map(o => o.customer && o.customer.name));
    const free = NAMES.filter(n => !used.has(n));
    return { name: free[Math.floor(Math.random() * free.length)], seed: Math.floor(Math.random() * 100000) };
  }

  function makeOrder(orders) {
    const sorted = availableDishes().sort((a, b) => DATA.cost(a) - DATA.cost(b));
    if (!sorted.length) return null;
    const maxDish = DATA.cost(sorted[sorted.length - 1]);
    // objetivo de costo del pedido: entre 8% y 20% de la energía diaria, acotado por lo que existe
    const target = S.settings.energy * (0.08 + Math.random() * 0.12);
    const items = [];
    let spent = 0;
    while (items.length < 3) {
      const id = pickDish(sorted, orders.concat([{ items }]), Math.max(DATA.cost(sorted[0]), target - spent));
      items.push({ id, done: false });
      spent += DATA.cost(id);
      if (spent >= target * 0.7 || spent + DATA.cost(sorted[0]) > target) break;
      if (maxDish >= target && Math.random() < 0.5) break;
    }
    return { items, done: false, customer: makeCustomer(orders) };
  }

  function makeOrders(n) {
    const orders = [];
    for (let i = 0; i < n; i++) { const o = makeOrder(orders); if (o) orders.push(o); }
    return orders;
  }

  function matches(cell, id) { return cell && cell.id && !cell.big && cell.id === id; }

  // ¿Queda algo en el tablero que se pueda entregar o cocinar hacia un pedido? Si no, con energía 0 el día terminó.
  function anyDeliverable() {
    const wanted = wantedSet();
    for (const row of S.board) for (const it of row) if (it && it.id && !it.big && wanted.has(it.id)) return true;
    return false;
  }

  function deliver(orderIdx, r, c) {
    const it = S.board[r][c];
    const order = S.orders[orderIdx];
    if (!it || !order || order.done) return false;
    const need = order.items.find(x => !x.done && matches(it, x.id));
    if (!need) return false;
    need.done = true;
    S.board[r][c] = null;
    if (order.items.every(x => x.done)) {
      order.done = true;
      order.thanksAt = now();
      S.stars++;
      S.delivered = (S.delivered || 0) + 1;
      if (S.orders.every(o => o.done)) finishTable();
      applyUnlocks(true);
    }
    save();
    return true;
  }

  // La mesa entera se levanta: propina (+2 estrellas y un ingrediente útil para la mesa siguiente) y llegan clientes nuevos.
  function finishTable() {
    S.tables = (S.tables || 0) + 1;
    S.stars += 2;
    const fresh = makeOrders(S.settings.orders);
    // regalo: nivel 3 de una cadena que la mesa nueva necesita
    const needs = new Set();
    for (const o of fresh) for (const x of o.items) DATA.gensFor(x.id).forEach(g => needs.add(g));
    const gens = unlockedGens().filter(g => needs.has(g));
    const chain = gens.length ? gens[Math.floor(Math.random() * gens.length)] : unlockedGens()[0];
    let giftMsg = '';
    if (chain) {
      const spot = nearestFree(3, 2);
      if (spot) { S.board[spot[0]][spot[1]] = { id: chain + '3', gift: true }; giftMsg = ` y te dejan ${DATA.ingName(chain + '3').toLowerCase()} de propina`; }
    }
    S.lastTable = { at: now(), names: S.orders.map(o => o.customer ? o.customer.name : '').filter(Boolean) };
    S.orders = fresh;
    flash(`Mesa completa: +2 estrellas${giftMsg}.`, 3500);
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
    if (S.energy === 1) S.lastEnergyAt = now();
    const spot = nearestFree(r, c);
    if (!spot) { flash('Tablero lleno'); return; }
    S.energy--;
    S.board[spot[0]][spot[1]] = { id: g.gen + (Math.random() < 0.8 ? 1 : 2) };
    save();
  }

  function isIng(cell) { return cell && cell.id && DATA.isIngredient(cell.id); }
  function isDish(cell) { return cell && cell.id && DISHES[cell.id]; }
  function movable(cell) { return cell && cell.id; }

  function mergeResult(a, b) {
    if (!a || !b || !a.id || !b.id || a.id !== b.id) return null;
    if (isIng(a)) { const l = +a.id.slice(-1); return l < LEVELS ? { id: a.id.slice(0, -1) + (l + 1) } : null; }
    if (isDish(a) && !a.big && !b.big) return { id: a.id, big: true };
    return null;
  }

  // Poner un ingrediente/plato en una estación. Si completa una receta, sale el plato.
  function putInStation(r1, c1, r2, c2) {
    const a = S.board[r1][c1], st = S.board[r2][c2];
    if (!movable(a) || a.big) return false;
    const i = st.slots.indexOf(null);
    if (i < 0) { flash('La estación está llena'); return false; }
    st.slots[i] = a.id;
    S.board[r1][c1] = null;
    tryCook(r2, c2);
    save();
    return true;
  }

  function tryCook(r, c) {
    const st = S.board[r][c];
    const have = st.slots.filter(Boolean).slice().sort();
    const recipe = DATA.recipesAt(st.station).find(rc => {
      const need = rc.in.slice().sort();
      return need.length === have.length && need.every((x, i) => x === have[i]);
    });
    if (!recipe) return;
    const spot = nearestFree(r, c);
    if (!spot) { flash('No hay sitio para el plato'); return; }
    st.slots = Array(STATIONS[st.station].slots).fill(null);
    S.board[spot[0]][spot[1]] = { id: recipe.out };
    if (!S.discovered.includes(recipe.out)) { S.discovered.push(recipe.out); flash(`Receta nueva: ${DISHES[recipe.out].name}`); }
  }

  // Sacar lo que hay en una estación (toque corto): vuelve al tablero.
  function emptyStation(r, c) {
    const st = S.board[r][c];
    const ids = st.slots.filter(Boolean);
    if (!ids.length) return;
    for (const id of ids) {
      const spot = nearestFree(r, c);
      if (!spot) { flash('Tablero lleno'); break; }
      S.board[spot[0]][spot[1]] = { id };
      st.slots[st.slots.indexOf(id)] = null;
    }
    save();
  }

  function moveOrMerge(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return;
    const a = S.board[r1][c1], b = S.board[r2][c2];
    if (!movable(a)) return;
    if (a.gift) delete a.gift;
    if (!b) { S.board[r2][c2] = a; S.board[r1][c1] = null; }
    else if (b.station) { putInStation(r1, c1, r2, c2); return; }
    else { const m = mergeResult(a, b); if (!m) return; S.board[r2][c2] = m; S.board[r1][c1] = null; }
    save();
  }

  function remove(r, c) {
    const it = S.board[r][c];
    if (!movable(it)) return;
    S.board[r][c] = null;
    save();
  }

  // ---------- UI ----------
  const $ = id => document.getElementById(id);
  const app = $('app'), boardEl = $('board'), ordersEl = $('orders'), trashEl = $('trash');
  const noticeEl = $('notice'), overlay = $('overlay');
  let flashTimer = null;

  function flash(msg, ms = 1800) {
    noticeEl.textContent = msg; noticeEl.hidden = false;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { noticeEl.hidden = true; }, ms);
  }

  function itemEl(cell) {
    const el = document.createElement('div');
    if (cell.gen) {
      el.className = 'item gen';
      el.innerHTML = ART.generator(CHAINS[cell.gen].color, ICONS.svg(cell.gen + '1'));
      if (S.energy <= 0) el.classList.add('empty');
    } else if (cell.station) {
      const st = STATIONS[cell.station];
      el.className = 'item station';
      el.style.background = st.color;
      el.innerHTML = `<span class="st-icon">${ART.station(cell.station)}</span><span class="st-slots">${cell.slots.map(s => `<i class="${s ? 'full' : ''}"></i>`).join('')}</span>`;
      el.title = st.name;
    } else {
      const ing = DATA.isIngredient(cell.id);
      el.className = 'item ' + (ing ? 'ing' : 'dish');
      if (cell.big) el.classList.add('big');
      if (cell.gift) el.classList.add('gift');
      el.dataset.id = cell.id;
      if (ing) {
        const ch = CHAINS[cell.id.slice(0, -1)];
        el.style.background = ch.bg; el.style.boxShadow = `inset 0 0 0 3px ${ch.color}`;
        el.innerHTML = ICONS.svg(cell.id) + `<span class="lvl">${cell.id.slice(-1)}</span>`;
      } else {
        const d = DISHES[cell.id];
        el.style.background = DISH_BG[d.color] || '#fbf6ec'; el.style.boxShadow = `inset 0 0 0 3px ${d.color}`;
        el.innerHTML = ICONS.svg(cell.id);
      }
      el.title = DATA.itemName(cell.id) + (cell.big ? ' (grande)' : '');
    }
    return el;
  }

  function wantedSet() {
    const w = new Set();
    for (const o of S.orders) if (!o.done) for (const x of o.items) if (!x.done) w.add(x.id);
    return w;
  }

  // Tamaño de celda: lo que quepa en el hueco que deja el resto de la pantalla, en ancho y en alto.
  const wrapEl = document.querySelector('.board-wrap');
  let lastCell = 0;
  function fitBoard() {
    const r = wrapEl.getBoundingClientRect();
    const availH = Math.max(0, window.innerHeight - r.top - 10);
    const availW = wrapEl.clientWidth - 12;
    const gap = 5;
    const cell = Math.floor(Math.min((availW - gap * (COLS - 1)) / COLS, (availH - gap * (ROWS - 1)) / ROWS));
    const c = Math.max(30, Math.min(64, cell));
    if (c !== lastCell) { lastCell = c; document.documentElement.style.setProperty('--cellpx', c + 'px'); }
  }
  window.addEventListener('resize', fitBoard);
  window.addEventListener('orientationchange', () => setTimeout(fitBoard, 50));
  if (window.ResizeObserver) new ResizeObserver(fitBoard).observe(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBoard);
  window.addEventListener('load', () => { fitBoard(); setTimeout(fitBoard, 300); });

  function render() {
    const t = now();
    fitBoard();
    $('energy').innerHTML = `${ART.icon('energy', 18)} ${S.energy}`;
    const starsEl = $('stars');
    if (starsEl.dataset.v && starsEl.dataset.v !== String(S.stars)) { starsEl.classList.remove('bump'); void starsEl.offsetWidth; starsEl.classList.add('bump'); }
    starsEl.innerHTML = `${ART.icon('star', 18)} ${S.stars}`; starsEl.dataset.v = S.stars;

    // Cabecera del local: escena recortada + próximo desbloqueo
    const strip = $('local-strip');
    const key = `${decoCount()}|${S.tables || 0}`;
    if (strip.dataset.key !== key) { strip.dataset.key = key; strip.innerHTML = LOCAL.render(decoCount(), S.tables || 0).strip; }
    const next = UNLOCKS[S.unlockedIdx];
    const prevStars = S.unlockedIdx ? UNLOCKS[S.unlockedIdx - 1].stars : 0;
    const pct = next ? Math.min(100, Math.round(100 * (S.stars - prevStars) / Math.max(1, next.stars - prevStars))) : 100;
    $('next-fill').style.width = pct + '%';
    $('next-text').textContent = next ? `Próximo: ${unlockName(next)} · ${next.stars - S.stars} ★` : 'Todo desbloqueado';

    // Pedidos
    const onBoard = new Set();
    for (const row of S.board) for (const it of row) if (it && it.id && !it.big) onBoard.add(it.id);
    ordersEl.innerHTML = '';
    S.orders.forEach((o, i) => {
      const el = document.createElement('div');
      el.className = 'order' + (o.done ? ' done' : '');
      el.dataset.order = i;
      const itemsWrap = document.createElement('div'); itemsWrap.className = 'dishes';
      if (o.customer) {
        const who = document.createElement('div');
        who.className = 'who';
        who.innerHTML = `<span class="face">${ART.avatar(o.customer.seed ?? 1, o.done ? 'happy' : 'neutral', 26)}</span><span class="name">${o.customer.name}</span>`;
        el.appendChild(who);
      }
      if (o.done) {
        const th = document.createElement('div');
        th.className = 'thanks' + (o.thanksAt && t - o.thanksAt < 1500 ? ' pop' : '');
        th.textContent = '¡Gracias!';
        el.appendChild(th);
        ordersEl.appendChild(el);
        return;
      }
      let ready = !o.done;
      for (const x of o.items) {
        const ie = itemEl({ id: x.id });
        if (x.done) ie.classList.add('done');
        else if (onBoard.has(x.id)) ie.classList.add('have');
        else ready = false;
        itemsWrap.appendChild(ie);
      }
      el.appendChild(itemsWrap);
      if (ready) el.classList.add('ready');
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
        if (it.id && !it.big && wanted.has(it.id)) el.classList.add('wants');
        cell.appendChild(el);
      }
      boardEl.appendChild(cell);
    }

    // Bloqueos
    let lock = HUB.lock();
    if (!lock && S.energy <= 0 && !anyDeliverable()) {
      S.dayDone = true;
      const nu = S.newUnlocks || [];
      const extra = nu.length ? ` Nuevo: ${nu.join(', ')}.` : '';
      lock = ['Listo por hoy', `${S.delivered || 0} pedidos entregados, ${S.stars} estrellas en total.${extra} La energía vuelve mañana a las ${S.settings.resetHour}:00.`];
    }
    if (lock && lock[0] === 'Listo por hoy') endSession();
    app.classList.toggle('locked', !!lock);
    overlay.hidden = !lock;
    if (lock) { $('overlay-title').textContent = lock[0]; $('overlay-text').textContent = lock[1]; }

    if (!lock && pendingCards.length && $('unlock').hidden) showUnlockCard(pendingCards.shift());

    const w = HUB.warn();
    if (!lock && w) { noticeEl.textContent = w; noticeEl.hidden = false; }
  }

  // ---------- Drag & drop ----------
  let drag = null;

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
    if (!drag) document.querySelectorAll('.order.accepts').forEach(e => e.classList.remove('accepts'));
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
    if (boardEl.setPointerCapture) boardEl.setPointerCapture(e.pointerId);
  });

  boardEl.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 6) return;
      if (!movable(drag.it)) return;
      drag.moved = true;
      drag.ghost = itemEl(drag.it);
      drag.ghost.classList.add('dragging');
      document.body.appendChild(drag.ghost);
      drag.src.classList.add('ghost');
      trashEl.classList.add('show');
      S.orders.forEach((o, i) => {
        if (!o.done && o.items.some(x => !x.done && matches(drag.it, x.id))) ordersEl.children[i].classList.add('accepts');
      });
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
      else if (d.it.station) { if (d.it.slots.some(Boolean)) emptyStation(d.r, d.c); else showStation(d.it.station); }
      else {
        const i = S.orders.findIndex(o => !o.done && o.items.some(x => !x.done && matches(d.it, x.id)));
        if (i >= 0) deliver(i, d.r, d.c);
        else if (isDish(d.it)) showRecipe(d.it.id);
      }
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

  // ---------- Popups: receta, cadena, estación, libro ----------
  function haveOnBoard() {
    const m = {};
    for (const row of S.board) for (const it of row) {
      if (it && it.id && !it.big) m[it.id] = (m[it.id] || 0) + 1;
      if (it && it.station) for (const s of it.slots) if (s) m[s] = (m[s] || 0) + 1;
    }
    return m;
  }

  // Árbol de receta en HTML: plato ← estación(ingredientes…), recursivo.
  function treeHtml(id, have, depth = 0) {
    const r = DATA.recipeFor(id);
    const el = itemEl({ id });
    const n = have[id] || 0;
    const line = `<div class="tree-node" style="--d:${depth}">${el.outerHTML}<span class="tree-name">${DATA.itemName(id)}${n ? ` <b>×${n}</b>` : ''}</span>${!r ? `<span class="tree-cost">${DATA.cost(id)} toques</span>` : ''}</div>`;
    if (!r) {
      // ingrediente: mostrar su cadena corta si es nivel > 1
      const lvl = +id.slice(-1);
      if (lvl > 1) {
        const ch = id.slice(0, -1);
        const chain = Array.from({ length: lvl }, (_, i) => itemEl({ id: ch + (i + 1) }).outerHTML).join('<span class="arrow">›</span>');
        return line + `<div class="tree-chain" style="--d:${depth + 1}">${chain}</div>`;
      }
      return line;
    }
    const st = STATIONS[r.station];
    return line + `<div class="tree-station" style="--d:${depth + 1}">${ART.station(r.station, 16)} ${st.name}</div>` + r.in.map(i => treeHtml(i, have, depth + 1)).join('');
  }

  function showRecipe(id) {
    const d = DISHES[id];
    $('chain-title').textContent = d.name;
    $('chain-row').innerHTML = treeHtml(id, haveOnBoard());
    $('chain-text').textContent = `${DATA.cost(id)} toques de generador en total.` + (S.discovered.includes(id) ? '' : ' Todavía no la hiciste.');
    $('chain').hidden = false;
  }

  function showStation(stId) {
    const st = STATIONS[stId];
    $('chain-title').textContent = st.name;
    const list = DATA.recipesAt(stId).filter(r => makeable(r.out));
    $('chain-row').innerHTML = list.map(r =>
      `<div class="book-row ${S.discovered.includes(r.out) ? '' : 'undiscovered'}">${r.in.map(i => itemEl({ id: i }).outerHTML).join('<span class="plus">+</span>')}<span class="arrow">›</span>${itemEl({ id: r.out }).outerHTML}<span class="tree-name">${S.discovered.includes(r.out) ? DISHES[r.out].name : '?'}</span></div>`
    ).join('') || '<p class="muted">Todavía no hay recetas para esta estación.</p>';
    $('chain-text').textContent = `Arrastrá ingredientes a la estación. Cuando coinciden con una receta, el plato sale al instante. Tocá la estación para vaciarla.`;
    $('chain').hidden = false;
  }

  ordersEl.addEventListener('click', e => {
    const ie = e.target.closest('.item');
    if (!ie || !ie.dataset.id) return;
    showRecipe(ie.dataset.id);
  });
  $('chain-close').addEventListener('click', () => { $('chain').hidden = true; });

  // Libro de recetas
  $('book-btn').addEventListener('click', () => {
    const sts = unlockedStations();
    const avail = availableDishes();
    $('chain-title').textContent = `Recetas · ${S.discovered.length} de ${avail.length}`;
    $('chain-row').innerHTML = sts.map(stId => {
      const list = DATA.recipesAt(stId).filter(r => makeable(r.out));
      return `<h3 class="book-h">${ART.station(stId, 18)} ${STATIONS[stId].name}</h3>` + list.map(r =>
        `<div class="book-row ${S.discovered.includes(r.out) ? '' : 'undiscovered'}" data-dish="${r.out}">${r.in.map(i => itemEl({ id: i }).outerHTML).join('<span class="plus">+</span>')}<span class="arrow">›</span>${itemEl({ id: r.out }).outerHTML}<span class="tree-name">${S.discovered.includes(r.out) ? DISHES[r.out].name : '?'}</span></div>`
      ).join('');
    }).join('');
    const next = UNLOCKS[S.unlockedIdx];
    $('chain-text').textContent = next ? `Próximo desbloqueo a las ${next.stars} estrellas (tenés ${S.stars}).` : 'Todo desbloqueado.';
    $('chain').hidden = false;
  });
  $('chain-row').addEventListener('click', e => {
    const row = e.target.closest('.book-row[data-dish]');
    if (row) showRecipe(row.dataset.dish);
  });

  // ---------- Tarjeta de desbloqueo ----------
  function showUnlockCard(u) {
    let art = '', title = '', text = '';
    if (u.kind === 'deco') {
      const p = LOCAL.pieces[u.id];
      title = p.name; text = 'Nueva pieza en el local.';
      art = LOCAL.renderPiece(u.id);
    } else if (u.kind === 'gen') {
      const ch = CHAINS[u.id];
      title = `Generador de ${ch.name.toLowerCase()}`; text = `Produce ${ch.items.map(x => x.toLowerCase()).join(' → ')}. Ya está en el tablero.`;
      art = `<div class="item gen" style="position:static;width:72px;height:72px">${ART.generator(ch.color, ICONS.svg(u.id + '1'))}</div>`;
    } else if (u.kind === 'station') {
      const st = STATIONS[u.id];
      const n = DATA.recipesAt(u.id).length;
      title = st.name; text = `Nueva estación con ${n} recetas por descubrir. Ya está en el tablero.`;
      art = `<div class="item station" style="position:static;width:72px;height:72px;background:${st.color}"><span class="st-icon">${ART.station(u.id, 48)}</span></div>`;
    } else { title = 'Tablero más grande'; text = 'Una fila y una columna más.'; art = '<div style="font-size:48px">▦</div>'; }
    $('unlock-title').textContent = title;
    $('unlock-art').innerHTML = art;
    $('unlock-text').textContent = text;
    $('unlock').hidden = false;
  }
  $('unlock-close').addEventListener('click', () => { $('unlock').hidden = true; render(); });
  $('local-strip').addEventListener('click', () => $('local-btn').click());

  // ---------- El local ----------
  $('local-btn').addEventListener('click', () => {
    const { svg, caption } = LOCAL.render(decoCount(), S.tables || 0);
    $('local-scene').innerHTML = svg;
    $('local-caption').textContent = caption;
    $('local').hidden = false;
  });
  $('local-close').addEventListener('click', () => { $('local').hidden = true; });

  // ---------- Ajustes ----------
  const FIELDS = [['energy', 'Energía diaria'], ['orders', 'Clientes por mesa']];
  $('settings-btn').addEventListener('click', () => {
    const cur = { ...S.settings, ...(S.pendingSettings || {}) };
    const form = $('settings-form');
    form.innerHTML = '';
    for (const [k, label] of FIELDS) {
      const l = document.createElement('label');
      l.innerHTML = `<span>${label}</span>`;
      const inp = document.createElement('input'); inp.type = 'number'; inp.name = k; inp.value = cur[k];
      l.appendChild(inp); form.appendChild(l);
    }
    $('settings').hidden = false;
  });
  $('settings-cancel').addEventListener('click', () => { $('settings').hidden = true; });
  $('settings-save').addEventListener('click', () => {
    const data = new FormData($('settings-form'));
    const p = {};
    for (const [k] of FIELDS) p[k] = Math.max(1, Number(data.get(k)));
    S.pendingSettings = p;
    save();
    $('settings').hidden = true;
    HUB.toast('Guardado. Aplica desde el próximo reset.');
  });
  $('hub-limits').addEventListener('click', () => HUB.openSettings());
  document.addEventListener('hub:settings', render);

  // ---------- Arranque ----------
  syncSize();
  applyUnlocks(false);
  maybeReset();
  // Pedidos cerrados que hayan quedado de una versión anterior, o un número distinto de huecos: se rellenan.
  if (!S.orders.length || S.orders.every(o => o.done) || S.orders.some(o => !o.customer)) S.orders = makeOrders(S.settings.orders);
  save();
  render();
  setInterval(() => { checkIdle(); maybeReset(); render(); }, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkIdle(); maybeReset(); render(); } });


  if (DEV) window.bistro = {
    S, save, render, generate, moveOrMerge, deliver, remove, touch, maybeReset, gameDay,
    applyUnlocks, makeable, availableDishes, tryCook, putInStation, emptyStation,
    reset: () => { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(OLD_KEY); location.reload(); },
    cheat: n => { S.stars = n; applyUnlocks(false); S.orders = makeOrders(S.settings.orders); save(); render(); },
  };
})();
