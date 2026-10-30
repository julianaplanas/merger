/* HUB — lo común a los tres juegos: contador de minutos, ajustes y límites opcionales.
   Se carga en cada página. Estado en localStorage bajo 'hub.v1'. */

window.HUB = (() => {
  const KEY = 'hub.v1';
  const DEV = ['localhost', '127.0.0.1'].includes(location.hostname);

  const DEFAULTS = {
    schedule: false,                 // horario de juego (apagado por defecto)
    openHour: 8, closeHour: 19, days: [1, 2, 3, 4, 5],
    sessionLimit: false,             // límite de sesión continua (apagado por defecto)
    warnMin: 8, stopMin: 12, pauseMin: 20,
    idleSec: 60,
  };

  let H = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { const h = JSON.parse(raw); h.settings = { ...DEFAULTS, ...(h.settings || {}) }; return h; } } catch (e) {}
    // migración del contador de minutos del Bistró v2
    let minutes = {};
    try { const b = JSON.parse(localStorage.getItem('bistro.v2') || 'null'); if (b && b.minutes) minutes = b.minutes; } catch (e) {}
    return { settings: { ...DEFAULTS }, minutes, session: null, pausedUntil: 0, last: null };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(H)); } catch (e) {} }

  const now = () => Date.now();
  function day(t = now()) {
    const d = new Date(t - 7 * 3600e3); // el día cambia a las 7:00
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  // ---- sesiones y minutos ----
  function endSession(t = now()) {
    if (!H.session) return;
    const ms = Math.max(0, Math.min(t, H.session.lastTouch + H.settings.idleSec * 1000) - H.session.startedAt);
    const d = day(H.session.startedAt);
    H.minutes[d] = (H.minutes[d] || 0) + ms / 60000;
    H.session = null;
    save();
  }
  function checkIdle() { if (H.session && now() - H.session.lastTouch > H.settings.idleSec * 1000) endSession(); }
  // Registra actividad. Devuelve false si el límite de sesión (opcional) acaba de cerrar el juego.
  function touch() {
    const t = now();
    checkIdle();
    if (!H.session) H.session = { startedAt: t, lastTouch: t };
    H.session.lastTouch = t;
    if (H.settings.sessionLimit && (t - H.session.startedAt) / 60000 >= H.settings.stopMin) {
      H.pausedUntil = t + H.settings.pauseMin * 60000;
      endSession(t);
      return false;
    }
    if (Math.random() < 0.1) save();
    return true;
  }
  function minutesToday() { return (H.minutes[day()] || 0) + (H.session ? (now() - H.session.startedAt) / 60000 : 0); }
  function minutesThisWeek() {
    const t = now(), dow = (new Date(t).getDay() + 6) % 7;
    let total = H.session ? (t - H.session.startedAt) / 60000 : 0;
    for (let i = 0; i <= dow; i++) total += H.minutes[day(t - i * 86400000)] || 0;
    return total;
  }
  function sessionMinutes() { return H.session ? (now() - H.session.startedAt) / 60000 : 0; }

  // ---- límites opcionales ----
  function isOpen(t = now()) {
    if (!H.settings.schedule || DEV) return true;
    const d = new Date(t), h = d.getHours() + d.getMinutes() / 60;
    return H.settings.days.includes(d.getDay()) && h >= H.settings.openHour && h < H.settings.closeHour;
  }
  function nextOpening(t = now()) {
    const d = new Date(t);
    for (let i = 0; i < 8; i++) {
      const c = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, H.settings.openHour, 0, 0);
      if (H.settings.days.includes(c.getDay()) && c.getTime() > t) return c;
    }
    return null;
  }
  function fmtOpening(d) {
    if (!d) return 'más adelante';
    const t = now();
    const hh = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (new Date(t).toDateString() === d.toDateString()) return `hoy a las ${hh}`;
    if (new Date(t + 86400000).toDateString() === d.toDateString()) return `mañana a las ${hh}`;
    return `${['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'][d.getDay()]} a las ${hh}`;
  }
  // Devuelve null si se puede jugar, o [título, texto] del bloqueo.
  function lock() {
    const t = now();
    if (!isOpen(t)) return ['Cerrado', `El horario de juego está activado en Ajustes. Abre ${fmtOpening(nextOpening(t))}.`];
    if (H.settings.sessionLimit && H.pausedUntil > t) return ['Pausa', `Llevabas ${H.settings.stopMin} minutos seguidos. Vuelve en ${Math.ceil((H.pausedUntil - t) / 60000)} min.`];
    return null;
  }
  function warn() {
    return H.settings.sessionLimit && H.session && sessionMinutes() >= H.settings.warnMin ? `Llevás ${Math.floor(sessionMinutes())} minutos seguidos` : null;
  }

  // ---- UI común ----
  function minsLabel() { return `${Math.round(minutesToday())} min hoy · ${Math.round(minutesThisWeek())} esta semana`; }
  function mountTopbar(el, title, opts = {}) {
    el.innerHTML = `
      ${opts.back === false ? '' : '<button class="back" id="hub-back" aria-label="Volver">‹</button>'}
      <div class="title">${title}</div>
      <div class="spacer"></div>
      <div class="mins" id="hub-mins"></div>
      ${opts.extra || ''}
      <button class="icon-btn" id="hub-settings" aria-label="Ajustes">⚙</button>`;
    const back = el.querySelector('#hub-back');
    if (back) back.addEventListener('click', () => { endSession(); location.href = opts.backHref || '../'; });
    el.querySelector('#hub-settings').addEventListener('click', openSettings);
    const tick = () => { const m = el.querySelector('#hub-mins'); if (m) m.textContent = minsLabel(); };
    tick(); setInterval(() => { checkIdle(); tick(); }, 10000);
  }

  function toast(msg, ms = 1800) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), ms);
  }

  function openSettings() {
    let ov = document.getElementById('hub-settings-overlay');
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'hub-settings-overlay'; ov.className = 'overlay';
      ov.innerHTML = `<div class="card settings-card">
        <h1>Ajustes</h1>
        <p class="muted small">Tiempo jugado: <b id="st-mins"></b></p>
        <h2>Límites (opcionales)</h2>
        <label><span>Horario de juego<br><small class="muted">Fuera del horario, los juegos quedan en solo lectura</small></span><span class="switch"><input type="checkbox" id="st-schedule"><i></i></span></label>
        <label><span>De</span><input type="number" id="st-open" min="0" max="23"></label>
        <label><span>Hasta</span><input type="number" id="st-close" min="1" max="24"></label>
        <label><span>Días (0=dom … 6=sáb)</span><input type="text" id="st-days" style="width:110px;text-align:right;font:inherit;border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff;color:var(--ink)"></label>
        <label><span>Límite de sesión<br><small class="muted">Aviso, cierre y pausa</small></span><span class="switch"><input type="checkbox" id="st-session"><i></i></span></label>
        <label><span>Aviso (min)</span><input type="number" id="st-warn" min="1"></label>
        <label><span>Cierre (min)</span><input type="number" id="st-stop" min="1"></label>
        <label><span>Pausa (min)</span><input type="number" id="st-pause" min="1"></label>
        <div class="row"><button class="btn" id="st-cancel">Cerrar</button><button class="btn primary" id="st-save">Guardar</button></div>
      </div>`;
      document.body.appendChild(ov);
      ov.querySelector('#st-cancel').addEventListener('click', () => { ov.hidden = true; });
      ov.querySelector('#st-save').addEventListener('click', () => {
        const s = H.settings, g = id => ov.querySelector('#' + id);
        s.schedule = g('st-schedule').checked; s.openHour = +g('st-open').value; s.closeHour = +g('st-close').value;
        s.days = g('st-days').value.split(',').map(Number).filter(n => n >= 0 && n <= 6);
        s.sessionLimit = g('st-session').checked; s.warnMin = +g('st-warn').value; s.stopMin = +g('st-stop').value; s.pauseMin = +g('st-pause').value;
        save(); ov.hidden = true; toast('Guardado'); document.dispatchEvent(new Event('hub:settings'));
      });
    }
    const s = H.settings, g = id => ov.querySelector('#' + id);
    g('st-mins').textContent = minsLabel();
    g('st-schedule').checked = s.schedule; g('st-open').value = s.openHour; g('st-close').value = s.closeHour; g('st-days').value = s.days.join(',');
    g('st-session').checked = s.sessionLimit; g('st-warn').value = s.warnMin; g('st-stop').value = s.stopMin; g('st-pause').value = s.pauseMin;
    ov.hidden = false;
  }

  // actividad global: cualquier toque cuenta como juego
  document.addEventListener('pointerdown', () => touch(), { capture: true, passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) endSession(); else checkIdle(); });
  window.addEventListener('pagehide', () => endSession());

  // service worker + recarga al actualizar
  if ('serviceWorker' in navigator && !DEV) {
    let had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) location.reload(); had = true; });
    const base = location.pathname.replace(/\/(merge|sort|diner)\/.*$/, '/').replace(/index\.html$/, '');
    navigator.serviceWorker.register(base + 'sw.js').then(r => r.update()).catch(() => {});
  }

  return { DEV, settings: () => H.settings, touch, lock, warn, minutesToday, minutesThisWeek, minsLabel, mountTopbar, toast, openSettings, endSession, day, fmtOpening, nextOpening };
})();
