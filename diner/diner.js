/* Servicio — atender mesas. Un día dura 90 s. Llegan grupos a la puerta; los sentás, tomás el
   pedido, la cocina lo prepara, lo servís y cobrás. Si se impacientan, se van. Con lo recaudado
   comprás mejoras entre días. Controles: tocar para seleccionar, tocar el destino. Cuando el
   destino es obvio (plato listo, mesa que pide, mesa que paga) basta un toque. */

(() => {
  'use strict';

  const KEY = 'diner.v1';
  const COIN = '<i class="coin"></i>';
  const DAY_SECONDS = 90;

  const DISHES = [
    { id: 'cafe', name: 'Café', art: 'cortado', time: 3, price: 4 },
    { id: 'tostada', name: 'Tostada', art: 'tostada', time: 4, price: 5 },
    { id: 'ensalada', name: 'Ensalada', art: 'ensaladaverde', time: 5, price: 7 },
    { id: 'pizza', name: 'Pizza', art: 'pizza', time: 7, price: 10 },
    { id: 'pasta', name: 'Pasta', art: 'pasta', time: 8, price: 11 },
    { id: 'tarta', name: 'Tarta', art: 'tartafresa', time: 5, price: 8 },
  ];

  const UPGRADES = [
    { id: 'table5', name: 'Quinta mesa', desc: 'Una mesa más para sentar gente.', cost: 120, icon: 'table' },
    { id: 'table6', name: 'Sexta mesa', desc: 'Y otra más.', cost: 260, icon: 'table', needs: 'table5' },
    { id: 'stove2', name: 'Segundo fogón', desc: 'La cocina prepara dos platos a la vez.', cost: 150, icon: 'flame' },
    { id: 'stove3', name: 'Tercer fogón', desc: 'Tres platos a la vez.', cost: 320, icon: 'flame', needs: 'stove2' },
    { id: 'fast', name: 'Cocina rápida', desc: 'Los platos se preparan un 25% más rápido.', cost: 200, icon: 'energy' },
    { id: 'music', name: 'Música', desc: 'Los clientes esperan un 30% más antes de irse.', cost: 180, icon: 'music' },
    { id: 'menu', name: 'Carta nueva', desc: 'Desbloquea pizza, pasta y tarta (más caras).', cost: 100, icon: 'book' },
    { id: 'tips', name: 'Servicio de lujo', desc: 'Propina doble si servís con la paciencia por encima de la mitad.', cost: 350, icon: 'star' },
  ];

  // ---------- Estado persistente ----------
  let S = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return { day: 1, coins: 0, owned: [], bestDay: 0, stars: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const has = id => S.owned.includes(id);

  // ---------- Estado de la partida (un día) ----------
  let G = null;
  function tablesCount() { return 4 + (has('table5') ? 1 : 0) + (has('table6') ? 1 : 0); }
  function stoves() { return 1 + (has('stove2') ? 1 : 0) + (has('stove3') ? 1 : 0); }
  function menu() { return has('menu') ? DISHES : DISHES.slice(0, 3); }
  function patienceMax() { return 22 * (has('music') ? 1.3 : 1); }
  function goalFor(day) { return Math.round((55 + day * 12) / 5) * 5; }

  function newDay() {
    G = {
      t: 0, over: false, coins: 0, served: 0, lost: 0,
      queue: [],           // grupos esperando en la puerta
      tables: Array.from({ length: tablesCount() }, (_, i) => ({ i, group: null })),
      kitchen: [],         // tickets: { table, dish, progress, done }
      counter: [],         // platos listos: { table, dish }
      nextArrival: 1.5,
      selected: null,      // { kind: 'queue'|'counter', idx }
      goal: goalFor(S.day),
      nextId: 1,
    };
  }

  function spawnGroup() {
    const p2 = Math.min(0.75, 0.35 + S.day * 0.04);           // grupos de 2 más frecuentes con los días
    const size = Math.random() < p2 ? 2 : 1;
    const faces = Array.from({ length: size }, () => Math.floor(Math.random() * 100000)); // semillas de avatar
    const m = menu();
    const orders = faces.map(() => m[Math.floor(Math.random() * m.length)].id);
    G.queue.push({ id: G.nextId++, faces, orders, patience: patienceMax(), state: 'waiting' });
  }

  // Estados de una mesa con grupo: seated(pensando) → ordering(burbuja: tocar para tomar) → waiting(cocina) → eating → paying(tocar para cobrar)
  function seat(qIdx, tIdx) {
    const g = G.queue.splice(qIdx, 1)[0];
    g.state = 'seated'; g.timer = 2; g.patience = patienceMax(); g.served = 0;
    G.tables[tIdx].group = g;
  }
  function takeOrder(tIdx) {
    const g = G.tables[tIdx].group;
    if (!g || g.state !== 'ordering') return false;
    g.state = 'waiting';
    g.patience = patienceMax();
    for (const d of g.orders) G.kitchen.push({ table: tIdx, dish: d, progress: 0, done: false });
    return true;
  }
  function serve(cIdx) {
    const plate = G.counter[cIdx];
    const g = G.tables[plate.table].group;
    if (!g || g.state !== 'waiting') return false;
    G.counter.splice(cIdx, 1);
    g.served++;
    g.lastPatience = g.patience;
    if (g.served >= g.orders.length) { g.state = 'eating'; g.timer = 4; }
    else g.patience = patienceMax();
    return true;
  }
  function collect(tIdx) {
    const g = G.tables[tIdx].group;
    if (!g || g.state !== 'paying') return false;
    let total = g.orders.reduce((s, id) => s + DISHES.find(d => d.id === id).price, 0);
    const good = (g.lastPatience || 0) > patienceMax() / 2;
    const tip = good ? Math.round(total * (has('tips') ? 0.6 : 0.3)) : 0;
    total += tip;
    G.coins += total; G.served += g.orders.length;
    G.tables[tIdx].group = null;
    fx(`+${total}`, tIdx, good ? 'good' : '');
    return true;
  }

  function leave(where, idx) {
    if (where === 'queue') G.queue.splice(idx, 1);
    else {
      // quita también sus tickets y platos
      G.kitchen = G.kitchen.filter(k => k.table !== idx);
      G.counter = G.counter.filter(c => c.table !== idx);
      G.tables[idx].group = null;
    }
    G.lost++;
    toast('Un cliente se fue sin comer');
  }

  // ---------- Bucle ----------
  let last = 0, raf = 0;
  function loop(ts) {
    if (!G || G.over) return;
    const dt = Math.min(0.1, (ts - last) / 1000 || 0); last = ts;
    const lock = HUB.lock();
    if (!lock && !document.hidden) step(dt);
    render();
    raf = requestAnimationFrame(loop);
  }

  function step(dt) {
    G.t += dt;
    if (G.t >= DAY_SECONDS && !G.queue.length && G.tables.every(t => !t.group)) { endDay(); return; }
    // llegadas (hasta los últimos 12 s)
    if (G.t < DAY_SECONDS - 12) {
      G.nextArrival -= dt;
      if (G.nextArrival <= 0 && G.queue.length < 5) {
        spawnGroup();
        const base = Math.max(2.8, 8 - S.day * 0.45);
        G.nextArrival = base * (0.7 + Math.random() * 0.6);
      }
    } else if (G.t >= DAY_SECONDS + 25) { endDay(); return; } // nadie se queda eternamente
    // cola
    for (let i = G.queue.length - 1; i >= 0; i--) {
      G.queue[i].patience -= dt;
      if (G.queue[i].patience <= 0) leave('queue', i);
    }
    // mesas
    G.tables.forEach((t, i) => {
      const g = t.group; if (!g) return;
      if (g.state === 'seated') { g.timer -= dt; if (g.timer <= 0) { g.state = 'ordering'; g.patience = patienceMax(); } }
      else if (g.state === 'ordering' || g.state === 'waiting') { g.patience -= dt; if (g.patience <= 0) leave('table', i); }
      else if (g.state === 'eating') { g.timer -= dt; if (g.timer <= 0) { g.state = 'paying'; g.patience = patienceMax() * 1.5; } }
      else if (g.state === 'paying') { g.patience -= dt; if (g.patience <= 0) { collect(i); } } // si no cobrás, pagan y se van igual (sin propina)
    });
    // cocina: hasta `stoves()` tickets avanzan a la vez
    let active = 0;
    const speed = has('fast') ? 1.25 : 1;
    for (const k of G.kitchen) {
      if (k.done) continue;
      if (active >= stoves()) break;
      active++;
      const dish = DISHES.find(d => d.id === k.dish);
      k.progress += dt * speed / dish.time;
      if (k.progress >= 1) { k.done = true; G.counter.push({ table: k.table, dish: k.dish }); }
    }
    G.kitchen = G.kitchen.filter(k => !k.done);
  }

  function endDay() {
    G.over = true;
    cancelAnimationFrame(raf);
    const stars = G.coins >= G.goal * 1.6 ? 3 : G.coins >= G.goal * 1.2 ? 2 : G.coins >= G.goal ? 1 : 0;
    S.coins += G.coins;
    S.stars[S.day] = Math.max(S.stars[S.day] || 0, stars);
    if (G.coins > S.bestDay) S.bestDay = G.coins;
    if (stars > 0) S.day++;
    save();
    $('end-title').textContent = stars ? `Día ${S.day - 1} cerrado` : 'Día flojo';
    $('end-stars').innerHTML = Array.from({ length: 3 }, (_, i) => `<span class="${i < stars ? 'on' : 'off'}">${ART.icon('star', 34)}</span>`).join('');
    $('end-text').textContent = `${G.coins} monedas de ${G.goal} de objetivo · ${G.served} platos servidos · ${G.lost} clientes perdidos.` + (stars ? '' : ' Repetí el día; podés comprar mejoras antes.');
    $('end').hidden = false;
    HUB.endSession();
  }

  // ---------- Interacción ----------
  function onQueue(i) {
    if (!HUB.touch()) return;
    const free = G.tables.map((t, j) => t.group ? -1 : j).filter(j => j >= 0);
    if (!free.length) { toast('No hay mesas libres'); return; }
    if (free.length === 1) { seat(i, free[0]); G.selected = null; return; }
    G.selected = G.selected && G.selected.kind === 'queue' && G.selected.idx === i ? null : { kind: 'queue', idx: i };
  }
  function onCounter(i) {
    if (!HUB.touch()) return;
    // el plato sabe a qué mesa va
    if (serve(i)) fxServe(G.counter, i); else toast('Esa mesa ya no está');
    G.selected = null;
  }
  function onTable(i) {
    if (!HUB.touch()) return;
    const t = G.tables[i];
    if (G.selected && G.selected.kind === 'queue') {
      if (!t.group) { seat(G.selected.idx, i); G.selected = null; return; }
      toast('Mesa ocupada'); return;
    }
    if (!t.group) { G.selected = null; return; }
    if (t.group.state === 'ordering') { takeOrder(i); fx('✓', i, 'good'); return; }
    if (t.group.state === 'paying') { collect(i); return; }
    if (t.group.state === 'waiting') {
      // ¿hay un plato suyo en el mostrador? servirlo directo
      const c = G.counter.findIndex(p => p.table === i);
      if (c >= 0) { serve(c); return; }
    }
  }

  // ---------- Render ----------
  const $ = id => document.getElementById(id);
  const roomEl = $('room'), queueEl = $('queue'), kitchenEl = $('kitchen'), counterEl = $('counter');
  const fxs = [];
  function fx(text, tIdx, cls = '') { fxs.push({ text, tIdx, cls, t: 0 }); }
  function fxServe() {}
  let toastT = 0, toastMsg = '';
  function toast(msg) { toastMsg = msg; toastT = 1.6; }

  function bar(p, max, cls = '') {
    const pct = Math.max(0, Math.min(100, 100 * p / max));
    const col = pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--accent2)' : 'var(--accent)';
    return `<div class="bar ${cls}"><i style="width:${pct}%;background:${col}"></i></div>`;
  }
  const dishIcon = id => { const d = DISHES.find(x => x.id === id); return d.art === 'pasta' ? ART.icon('pasta', 28) : ICONS.svg(d.art); };
  const faces = (g, mood) => g.faces.map(f => ART.avatar(f, mood, 30)).join('');
  function moodOf(g) {
    if (g.state === 'eating') return 'eating';
    if (g.state === 'paying') return 'happy';
    if (g.state === 'seated') return 'neutral';
    const p = g.patience / patienceMax();
    return p > 0.5 ? 'neutral' : p > 0.25 ? 'worried' : 'angry';
  }

  function render() {
    if (!G) return;
    $('d-day').textContent = `Día ${S.day}`;
    $('d-coins').innerHTML = `${COIN}${G.coins} / ${G.goal}`;
    const left = Math.max(0, DAY_SECONDS - G.t);
    $('d-time').textContent = left > 0 ? `${Math.ceil(left)} s` : 'Cerrando…';
    $('d-timebar').style.width = (100 * left / DAY_SECONDS) + '%';

    // cola
    queueEl.innerHTML = G.queue.map((g, i) => `
      <div class="guest ${G.selected && G.selected.kind === 'queue' && G.selected.idx === i ? 'selected' : ''}" data-q="${i}">
        <div class="faces">${faces(g, moodOf(g))}</div>${bar(g.patience, patienceMax())}
      </div>`).join('') || '<div class="empty-hint">Puerta</div>';

    // mesas
    roomEl.style.setProperty('--tables', G.tables.length);
    roomEl.innerHTML = G.tables.map((t, i) => {
      const g = t.group;
      let cls = 'table', inner = '';
      if (!g) { cls += ' free' + (G.selected && G.selected.kind === 'queue' ? ' target' : ''); inner = '<div class="plate-empty"></div>'; }
      else {
        cls += ' ' + g.state;
        const fc = `<div class="faces">${faces(g, moodOf(g))}</div>`;
        if (g.state === 'seated') inner = fc + '<div class="bubble think">…</div>';
        else if (g.state === 'ordering') inner = fc + `<div class="bubble order">${g.orders.map(dishIcon).join('')}</div>` + bar(g.patience, patienceMax());
        else if (g.state === 'waiting') inner = fc + `<div class="bubble wait">${g.orders.map((d, k) => `<span class="${k < g.served ? 'got' : ''}">${dishIcon(d)}</span>`).join('')}</div>` + bar(g.patience, patienceMax());
        else if (g.state === 'eating') inner = fc + `<div class="bubble eat">${g.orders.map(dishIcon).join('')}</div>` + bar(g.timer, 4, 'neutral');
        else if (g.state === 'paying') inner = fc + `<div class="bubble pay">${COIN}</div>`;
      }
      return `<div class="${cls}" data-t="${i}"><div class="top">${inner}</div><div class="legs"></div></div>`;
    }).join('');

    // cocina
    const sv = stoves();
    const active = G.kitchen.slice(0, sv);
    kitchenEl.innerHTML = Array.from({ length: sv }, (_, i) => {
      const k = active[i];
      return `<div class="stove ${k ? 'busy' : ''}">${k ? `<span class="dish">${dishIcon(k.dish)}</span><div class="ring" style="--p:${Math.round(k.progress * 100)}"></div><span class="tnum">${k.table + 1}</span>` : `<span class="dish dim">${ART.icon('flame', 26)}</span>`}</div>`;
    }).join('') + (G.kitchen.length > sv ? `<div class="pending">+${G.kitchen.length - sv} en espera</div>` : '');

    // mostrador
    counterEl.innerHTML = G.counter.map((p, i) => `<div class="plate" data-c="${i}"><span class="dish">${dishIcon(p.dish)}</span><span class="tnum">${p.table + 1}</span></div>`).join('') || '<div class="empty-hint">Mostrador</div>';

    // efectos
    const fxEl = $('fx'); fxEl.innerHTML = '';
    for (let i = fxs.length - 1; i >= 0; i--) {
      const f = fxs[i]; f.t += 1 / 60;
      if (f.t > 1) { fxs.splice(i, 1); continue; }
      const tEl = roomEl.children[f.tIdx]; if (!tEl) continue;
      const r = tEl.getBoundingClientRect();
      const e = document.createElement('div'); e.className = 'float ' + f.cls; e.textContent = f.text;
      e.style.left = (r.left + r.width / 2) + 'px'; e.style.top = (r.top - 40 * f.t) + 'px'; e.style.opacity = 1 - f.t;
      fxEl.appendChild(e);
    }
    if (toastT > 0) { toastT -= 1 / 60; $('d-toast').textContent = toastMsg; $('d-toast').hidden = false; } else $('d-toast').hidden = true;

    const lock = HUB.lock();
    $('lock').hidden = !lock;
    if (lock) { $('lock-title').textContent = lock[0]; $('lock-text').textContent = lock[1]; }
  }

  // ---------- Menú de día / mejoras ----------
  function renderStart() {
    $('s-day').textContent = `Día ${S.day}`;
    $('s-goal').textContent = `Objetivo: ${goalFor(S.day)} monedas en ${DAY_SECONDS} segundos`;
    $('s-coins').innerHTML = `${COIN}${S.coins}`;
    const list = $('upgrades'); list.innerHTML = '';
    for (const u of UPGRADES) {
      if (u.needs && !has(u.needs)) continue;
      const owned = has(u.id);
      const el = document.createElement('button');
      el.className = 'upg' + (owned ? ' owned' : S.coins >= u.cost ? ' can' : '');
      el.disabled = owned || S.coins < u.cost;
      el.innerHTML = `<span class="ic">${ART.icon(u.icon, 26)}</span><span class="tx"><b>${u.name}</b><small>${u.desc}</small></span><span class="pr">${owned ? '✓' : COIN + u.cost}</span>`;
      el.addEventListener('click', () => { if (!HUB.touch()) return; S.coins -= u.cost; S.owned.push(u.id); save(); renderStart(); HUB.toast(`${u.name} comprado`); });
      list.appendChild(el);
    }
    const bought = S.owned.length, total = UPGRADES.length;
    $('s-prog').textContent = `${bought} de ${total} mejoras · mejor día: ${S.bestDay} monedas`;
    $('start').hidden = false;
  }

  function startDay() {
    if (!HUB.touch()) return;
    $('start').hidden = true; $('end').hidden = true;
    newDay(); last = 0;
    raf = requestAnimationFrame(ts => { last = ts; loop(ts); });
  }

  // eventos
  queueEl.addEventListener('pointerdown', e => { const g = e.target.closest('.guest'); if (g) { e.preventDefault(); onQueue(+g.dataset.q); } });
  roomEl.addEventListener('pointerdown', e => { const t = e.target.closest('.table'); if (t) { e.preventDefault(); onTable(+t.dataset.t); } });
  counterEl.addEventListener('pointerdown', e => { const p = e.target.closest('.plate'); if (p) { e.preventDefault(); onCounter(+p.dataset.c); } });
  $('s-start').addEventListener('click', startDay);
  $('end-next').addEventListener('click', () => { $('end').hidden = true; renderStart(); });
  $('d-help').addEventListener('click', () => { $('help').hidden = false; });
  $('help-close').addEventListener('click', () => { $('help').hidden = true; });

  newDay(); render();
  renderStart();

  if (HUB.DEV) window.diner = { S, get G() { return G; }, step, newDay, spawnGroup, seat, takeOrder, serve, collect, endDay, startDay, render, DISHES, UPGRADES, reset: () => { localStorage.removeItem(KEY); location.reload(); } };
})();
