/* ART — dibujos compartidos en SVG: avatares de clientes, estaciones, herramientas, monedas.
   Todo plano, paleta cálida, sin emoji. viewBox 40×40 salvo que se indique. */

window.ART = (() => {
  const SKIN = ['#f3d2b3', '#e7b982', '#c98e5e', '#a86a3f', '#7a4a2c', '#f7dcc4'];
  const HAIR = ['#3d3129', '#5a3b26', '#a56b32', '#d9a066', '#8b8b8b', '#c9643f', '#2b2b35', '#e4b45a'];
  const SHIRT = ['#5d6b78', '#c9643f', '#7f9c6a', '#c97b8e', '#e4b45a', '#8fa7b8', '#9c8bc4', '#4f9a94'];

  // generador determinista a partir de una semilla
  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280;
    return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)];

  // mood: 'happy' | 'neutral' | 'worried' | 'angry' | 'eating'
  function avatar(seed, mood = 'happy', size = 40) {
    const r = rng(seed);
    const skin = pick(r, SKIN), hair = pick(r, HAIR), shirt = pick(r, SHIRT);
    const hairStyle = Math.floor(r() * 6), glasses = r() < 0.2, hat = r() < 0.12, beard = r() < 0.15;
    const blush = mood === 'happy' || mood === 'eating';
    let hairSvg = '';
    switch (hairStyle) {
      case 0: hairSvg = `<path d="M11 18 q0 -11 9 -11 q9 0 9 11 v-4 q-2 -4 -9 -4 q-7 0 -9 4 Z" fill="${hair}"/>`; break;                       // corto
      case 1: hairSvg = `<path d="M10 20 q-1 -14 10 -14 q11 0 10 14 l-2 1 v-5 q-2 -5 -8 -5 q-6 0 -8 5 v5 Z" fill="${hair}"/><rect x="9" y="18" width="4" height="10" rx="2" fill="${hair}"/><rect x="27" y="18" width="4" height="10" rx="2" fill="${hair}"/>`; break; // melena
      case 2: hairSvg = `<circle cx="20" cy="12" r="8" fill="${hair}"/><path d="M11 18 q0 -8 9 -8 q9 0 9 8 Z" fill="${hair}"/>`; break;         // afro/rulos
      case 3: hairSvg = `<path d="M11 18 q0 -11 9 -11 q9 0 9 11 v-3 q-3 -3 -9 -3 q-6 0 -9 3 Z" fill="${hair}"/><circle cx="20" cy="7" r="4" fill="${hair}"/>`; break; // rodete
      case 4: hairSvg = `<path d="M11 17 q2 -10 9 -10 q7 0 9 10 q-4 -5 -9 -5 q-5 0 -9 5 Z" fill="${hair}"/>`; break;                             // flequillo
      default: hairSvg = '';                                                                                                                    // calvo
    }
    let mouth, brows = '';
    switch (mood) {
      case 'happy': mouth = `<path d="M16 24 q4 4 8 0" stroke="#7a3d2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; break;
      case 'eating': mouth = `<ellipse cx="20" cy="24.5" rx="2.5" ry="2" fill="#7a3d2e"/>`; break;
      case 'worried': mouth = `<path d="M17 25 h6" stroke="#7a3d2e" stroke-width="1.6" stroke-linecap="round"/>`; brows = `<path d="M14 17 l4 1 M26 17 l-4 1" stroke="${hair}" stroke-width="1.4" stroke-linecap="round"/>`; break;
      case 'angry': mouth = `<path d="M16 26 q4 -3 8 0" stroke="#7a3d2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; brows = `<path d="M14 16 l4 2 M26 16 l-4 2" stroke="${hair}" stroke-width="1.6" stroke-linecap="round"/>`; break;
      default: mouth = `<path d="M17 24.5 h6" stroke="#7a3d2e" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    const eyes = mood === 'happy' && r() < 0.5
      ? `<path d="M15 20 q1.5 -2 3 0 M22 20 q1.5 -2 3 0" stroke="#3d3129" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      : `<circle cx="16.5" cy="20" r="1.4" fill="#3d3129"/><circle cx="23.5" cy="20" r="1.4" fill="#3d3129"/>`;
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 40 q0 -10 12 -10 q12 0 12 10 Z" fill="${shirt}"/>
      <rect x="17" y="27" width="6" height="5" fill="${skin}"/>
      <circle cx="20" cy="19" r="9.5" fill="${skin}"/>
      ${hairSvg}${hat ? `<path d="M9 14 h22 v2 h-22 Z M12 14 q0 -8 8 -8 q8 0 8 8 Z" fill="${shirt}"/>` : ''}
      ${brows}${eyes}
      ${glasses ? `<g fill="none" stroke="#3d3129" stroke-width="1.2"><circle cx="16.5" cy="20" r="3.2"/><circle cx="23.5" cy="20" r="3.2"/><path d="M19.7 20 h0.6"/></g>` : ''}
      ${blush ? `<circle cx="13.5" cy="23" r="1.6" fill="#e9a79a" opacity=".7"/><circle cx="26.5" cy="23" r="1.6" fill="#e9a79a" opacity=".7"/>` : ''}
      ${mouth}
      ${beard ? `<path d="M13 22 q7 10 14 0 q-2 8 -7 8 q-5 0 -7 -8 Z" fill="${hair}" opacity=".85"/>` : ''}
    </svg>`;
  }

  // ---- Estaciones (Bistró) ----
  const INK = '#3d3129', CREAM = '#fbf6ec', WOOD = '#c89a62', WOOD2 = '#a5783f', SLATE = '#5d6b78', TERRA = '#c9643f', GOLD = '#e4b45a';
  const STATIONS = {
    tabla: `<rect x="6" y="14" width="28" height="18" rx="4" fill="${WOOD}"/><rect x="6" y="14" width="28" height="4" rx="2" fill="${WOOD2}" opacity=".5"/><path d="M12 10 L28 26" stroke="${CREAM}" stroke-width="4" stroke-linecap="round"/><path d="M12 10 L17 15" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    horno: `<rect x="7" y="8" width="26" height="26" rx="4" fill="${SLATE}"/><rect x="10" y="14" width="20" height="14" rx="2" fill="#2d2740"/><path d="M16 26 q0 -6 4 -9 q4 3 4 9 Z" fill="${TERRA}"/><path d="M18 26 q0 -3 2 -5 q2 2 2 5 Z" fill="${GOLD}"/><g fill="${CREAM}"><circle cx="12" cy="11" r="1.2"/><circle cx="16" cy="11" r="1.2"/><circle cx="20" cy="11" r="1.2"/></g>`,
    sarten: `<circle cx="17" cy="22" r="11" fill="${INK}"/><circle cx="17" cy="22" r="8" fill="#55483f"/><path d="M27 20 L37 14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="17" cy="22" r="4.5" fill="${GOLD}"/><circle cx="17" cy="22" r="2" fill="${TERRA}"/>`,
    licuadora: `<path d="M12 8 h16 l-2 18 h-12 Z" fill="#dde7ee" opacity=".85"/><rect x="11" y="26" width="18" height="8" rx="3" fill="${INK}"/><rect x="14" y="12" width="12" height="12" fill="#95b07e" opacity=".9"/><rect x="13" y="6" width="14" height="3" rx="1.5" fill="${INK}"/><circle cx="20" cy="30" r="1.5" fill="${TERRA}"/>`,
    cafetera: `<rect x="8" y="8" width="24" height="12" rx="3" fill="${INK}"/><rect x="10" y="20" width="20" height="4" fill="#55483f"/><rect x="14" y="24" width="12" height="8" rx="2" fill="${CREAM}"/><rect x="12" y="32" width="16" height="3" rx="1.5" fill="${INK}"/><circle cx="26" cy="14" r="2" fill="${TERRA}"/><rect x="12" y="12" width="8" height="4" rx="1" fill="#55483f"/>`,
    heladera: `<rect x="10" y="5" width="20" height="30" rx="3" fill="#8fa7b8"/><rect x="10" y="5" width="20" height="11" rx="3" fill="#a7bccb"/><rect x="12" y="16" width="16" height="1.5" fill="#6b8597"/><rect x="26" y="8" width="1.8" height="5" rx=".9" fill="${CREAM}"/><rect x="26" y="19" width="1.8" height="8" rx=".9" fill="${CREAM}"/>`,
  };
  function station(id, size = 40) { return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${STATIONS[id] || ''}</svg>`; }

  // ---- Iconos sueltos ----
  const ICON = {
    coin: `<circle cx="20" cy="20" r="14" fill="#d9a52a"/><circle cx="20" cy="20" r="10" fill="#f0c857"/><circle cx="20" cy="20" r="6" fill="none" stroke="#d9a52a" stroke-width="2"/><path d="M12 12 q3 -4 8 -4" stroke="#fff6d6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`,
    star: `<path d="M20 4 l4.6 10 10.8 1 -8.2 7.2 2.5 10.8 -9.7 -5.8 -9.7 5.8 2.5 -10.8 -8.2 -7.2 10.8 -1 Z" fill="#e4b45a"/>`,
    energy: `<path d="M22 4 L10 23 h8 l-2 13 L30 17 h-8 Z" fill="#e4b45a" stroke="#b8882c" stroke-width="1.5" stroke-linejoin="round"/>`,
    book: `<path d="M8 8 h11 v26 h-11 Z" fill="#c9643f"/><path d="M21 8 h11 v26 h-11 Z" fill="#7f9c6a"/><rect x="19" y="8" width="2" height="26" fill="#3d3129"/><g stroke="#fbf6ec" stroke-width="1.5"><line x1="11" y1="14" x2="16" y2="14"/><line x1="11" y1="18" x2="16" y2="18"/><line x1="24" y1="14" x2="29" y2="14"/></g>`,
    house: `<path d="M6 20 L20 8 L34 20 v14 h-28 Z" fill="#c89a62"/><path d="M4 21 L20 7 L36 21" stroke="#c9643f" stroke-width="3" fill="none" stroke-linejoin="round"/><rect x="16" y="24" width="8" height="10" fill="#5d6b78"/><rect x="9" y="22" width="5" height="5" fill="#dde7ee"/>`,
    sliders: `<g stroke="#3d3129" stroke-width="2.5" stroke-linecap="round"><line x1="8" y1="13" x2="32" y2="13"/><line x1="8" y1="27" x2="32" y2="27"/></g><circle cx="15" cy="13" r="4" fill="#c9643f"/><circle cx="26" cy="27" r="4" fill="#7f9c6a"/>`,
    gear: `<circle cx="20" cy="20" r="7" fill="none" stroke="#8a7a6c" stroke-width="4"/><g stroke="#8a7a6c" stroke-width="4" stroke-linecap="round"><line x1="20" y1="6" x2="20" y2="10"/><line x1="20" y1="30" x2="20" y2="34"/><line x1="6" y1="20" x2="10" y2="20"/><line x1="30" y1="20" x2="34" y2="20"/><line x1="10" y1="10" x2="13" y2="13"/><line x1="27" y1="27" x2="30" y2="30"/><line x1="10" y1="30" x2="13" y2="27"/><line x1="27" y1="13" x2="30" y2="10"/></g>`,
    flame: `<path d="M20 6 q6 8 6 16 a6 6 0 0 1 -12 0 q0 -5 3 -8 q0 4 3 5 q0 -7 0 -13 Z" fill="#c9643f"/><path d="M20 18 q3 4 3 7 a3 3 0 0 1 -6 0 q0 -3 3 -7 Z" fill="#e4b45a"/>`,
    note: `<rect x="10" y="6" width="20" height="28" rx="3" fill="#fbf6ec" stroke="#8a7a6c" stroke-width="1.5"/><g stroke="#8a7a6c" stroke-width="1.8" stroke-linecap="round"><line x1="14" y1="14" x2="26" y2="14"/><line x1="14" y1="20" x2="24" y2="20"/><line x1="14" y1="26" x2="22" y2="26"/></g><path d="M22 28 l3 3 l5 -6" stroke="#5f8f4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    pasta: `<ellipse cx="20" cy="26" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 25 q0 -8 11 -8 q11 0 11 8 Z" fill="#f0c857"/><g stroke="#e4b45a" stroke-width="1.5" fill="none"><path d="M12 22 q4 -4 8 0 t8 0"/><path d="M11 25 q4 -3 9 0 t9 0"/></g><circle cx="20" cy="18" r="3.5" fill="#d9553f"/><circle cx="15" cy="21" r="1.2" fill="#7f9c6a"/><circle cx="25" cy="21" r="1.2" fill="#7f9c6a"/>`,
    trash: `<rect x="12" y="12" width="16" height="20" rx="2" fill="#8a7a6c"/><rect x="10" y="9" width="20" height="3" rx="1.5" fill="#3d3129"/><rect x="17" y="6" width="6" height="3" rx="1.5" fill="#3d3129"/><g stroke="#fbf6ec" stroke-width="1.5"><line x1="16" y1="16" x2="16" y2="28"/><line x1="20" y1="16" x2="20" y2="28"/><line x1="24" y1="16" x2="24" y2="28"/></g>`,
    undo: `<path d="M14 12 L8 18 L14 24" stroke="#3d3129" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18 h14 a7 7 0 0 1 0 14 h-6" stroke="#3d3129" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    restart: `<path d="M30 20 a10 10 0 1 1 -3 -7" stroke="#3d3129" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M27 6 v8 h-8" stroke="#3d3129" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    help: `<circle cx="20" cy="20" r="14" fill="#fbf6ec" stroke="#8a7a6c" stroke-width="2"/><path d="M15 16 q0 -5 5 -5 q5 0 5 4 q0 3 -4 4 q-1 .5 -1 3" stroke="#3d3129" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="27" r="1.6" fill="#3d3129"/>`,
    table: `<rect x="6" y="14" width="28" height="6" rx="3" fill="#c89a62"/><rect x="18" y="20" width="4" height="14" fill="#a5783f"/><rect x="12" y="32" width="16" height="3" rx="1.5" fill="#a5783f"/>`,
    music: `<path d="M16 30 V10 l14 -3 v18" stroke="#3d3129" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="12" cy="30" r="4" fill="#c9643f"/><circle cx="26" cy="26" r="4" fill="#c9643f"/>`,
    back: `<path d="M24 10 L14 20 L24 30" stroke="#3d3129" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  function icon(name, size = 20) { return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="ico ico-${name}">${ICON[name] || ''}</svg>`; }

  // ---- Generador (Bistró): rueda dentada de color con el ingrediente base dentro ----
  function generator(color, innerSvg) {
    return `<svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2 l3 3 4 -1 1 4 4 1 -1 4 3 3 -3 3 1 4 -4 1 -1 4 -4 -1 -3 3 -3 -3 -4 1 -1 -4 -4 -1 1 -4 -3 -3 3 -3 -1 -4 4 -1 1 -4 4 1 Z" fill="${color}"/>
      <circle cx="20" cy="20" r="12" fill="#fbf6ec" opacity=".92"/>
      <g transform="translate(8 8) scale(0.6)">${innerSvg.replace(/<\/?svg[^>]*>/g, '')}</g>
    </svg>`;
  }

  return { avatar, station, icon, generator, SKIN, HAIR, SHIRT };
})();
