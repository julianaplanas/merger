/* Iconos de los ítems. Uno por cadena y nivel, en SVG plano, viewBox 40×40.
   Mismo estilo que el local: formas simples, sin brillos. */

window.ICONS = (() => {
  const CREAM = '#fbf6ec', INK = '#3d3129', CRUST = '#c88a4a', CRUST2 = '#a56b32', FLOUR = '#f3e6cf',
        LEAF = '#7f9c6a', LEAF2 = '#5f7d4c', TOM = '#d9553f', BEAN = '#5a3b26', COFFEE = '#8b5e3c',
        MILK = '#f6efe3', CUP = '#fbf6ec', ROSE = '#c97b8e', PINK = '#e9b6c3', CHOC = '#5a3b26', SUGAR = '#fdfaf3',
        GOLD = '#e4b45a';

  const pan = [
    // 1 Harina
    `<path d="M11 10 h18 v6 l-2 2 v16 h-14 v-16 l-2 -2 Z" fill="${FLOUR}"/><rect x="11" y="10" width="18" height="6" fill="#e2cfae"/><rect x="15" y="22" width="10" height="7" rx="1" fill="${CRUST}"/>`,
    // 2 Masa
    `<ellipse cx="20" cy="24" rx="13" ry="9" fill="${FLOUR}"/><ellipse cx="20" cy="20" rx="12" ry="9" fill="#f8efdc"/><circle cx="15" cy="18" r="1.5" fill="#e2cfae"/><circle cx="24" cy="22" r="1.5" fill="#e2cfae"/>`,
    // 3 Pan
    `<path d="M8 26 v-6 q0 -8 12 -8 q12 0 12 8 v6 Z" fill="${CRUST}"/><rect x="8" y="24" width="24" height="7" rx="2" fill="${CRUST2}"/><path d="M14 16 q3 -3 6 0 M20 16 q3 -3 6 0" stroke="${CRUST2}" stroke-width="2" fill="none"/>`,
    // 4 Baguette
    `<path d="M6 28 L30 10 q4 -2 5 2 L12 32 q-4 2 -6 -4 Z" fill="${CRUST}"/><g stroke="${CRUST2}" stroke-width="2"><line x1="13" y1="24" x2="17" y2="27"/><line x1="18" y1="20" x2="22" y2="23"/><line x1="23" y1="16" x2="27" y2="19"/></g>`,
    // 5 Croissant
    `<path d="M8 24 q0 -10 12 -12 q12 2 12 12 q-6 6 -12 4 q-6 2 -12 -4 Z" fill="${CRUST}"/><path d="M14 23 q6 -4 12 0" stroke="${CRUST2}" stroke-width="2" fill="none"/><path d="M8 24 q4 -2 6 2 M32 24 q-4 -2 -6 2" stroke="${CRUST2}" stroke-width="2" fill="none"/>`,
    // 6 Tarta
    `<path d="M7 22 h26 v8 q-13 4 -26 0 Z" fill="${CRUST}"/><ellipse cx="20" cy="22" rx="13" ry="4" fill="${CRUST2}"/><g fill="${TOM}"><circle cx="14" cy="21" r="2.5"/><circle cx="20" cy="19" r="2.5"/><circle cx="26" cy="21" r="2.5"/><circle cx="17" cy="24" r="2"/><circle cx="23" cy="24" r="2"/></g>`,
    // 7 Pastel
    `<rect x="8" y="24" width="24" height="8" rx="2" fill="${PINK}"/><rect x="11" y="16" width="18" height="8" rx="2" fill="${CREAM}"/><rect x="14" y="10" width="12" height="6" rx="2" fill="${PINK}"/><rect x="19" y="5" width="2" height="5" fill="${GOLD}"/><circle cx="20" cy="4" r="1.5" fill="${TOM}"/>`,
  ];

  const huerta = [
    // 1 Semilla
    `<ellipse cx="20" cy="22" rx="7" ry="10" fill="${CRUST2}"/><path d="M20 14 q4 4 0 10" stroke="${CRUST}" stroke-width="2" fill="none"/>`,
    // 2 Brote
    `<rect x="19" y="20" width="2" height="12" fill="${LEAF2}"/><path d="M20 22 q-9 -2 -8 -10 q8 0 8 10 Z" fill="${LEAF}"/><path d="M20 22 q9 -2 8 -10 q-8 0 -8 10 Z" fill="${LEAF2}"/>`,
    // 3 Tomate
    `<circle cx="20" cy="23" r="11" fill="${TOM}"/><path d="M20 13 l-4 -3 M20 13 l4 -3 M20 13 v-4" stroke="${LEAF2}" stroke-width="2.5" stroke-linecap="round"/><circle cx="15" cy="19" r="2" fill="#e87a68"/>`,
    // 4 Ensalada
    `<path d="M7 20 h26 l-3 10 h-20 Z" fill="${CREAM}"/><g><circle cx="13" cy="18" r="4" fill="${LEAF}"/><circle cx="20" cy="16" r="5" fill="${LEAF2}"/><circle cx="27" cy="18" r="4" fill="${LEAF}"/><circle cx="17" cy="21" r="2.5" fill="${TOM}"/><circle cx="24" cy="21" r="2.5" fill="${TOM}"/></g>`,
    // 5 Gazpacho
    `<path d="M8 16 h24 l-3 14 h-18 Z" fill="${CREAM}"/><path d="M10 18 h20 l-2 10 h-16 Z" fill="${TOM}"/><circle cx="16" cy="22" r="1.5" fill="${LEAF}"/><circle cx="23" cy="24" r="1.5" fill="${CREAM}"/><rect x="18" y="8" width="4" height="10" fill="${LEAF2}" transform="rotate(20 20 13)"/>`,
    // 6 Ratatouille
    `<path d="M7 18 h26 v10 q-13 4 -26 0 Z" fill="#a5783f"/><g><ellipse cx="11" cy="18" rx="3" ry="5" fill="${TOM}"/><ellipse cx="16" cy="18" rx="3" ry="5" fill="${LEAF}"/><ellipse cx="21" cy="18" rx="3" ry="5" fill="#e4b45a"/><ellipse cx="26" cy="18" rx="3" ry="5" fill="${TOM}"/><ellipse cx="30" cy="18" rx="2.5" ry="5" fill="${LEAF}"/></g>`,
    // 7 Menú degustación
    `<rect x="6" y="18" width="28" height="4" rx="2" fill="#dcd0bb"/><path d="M10 18 q10 -14 20 0 Z" fill="#dde7ee" opacity=".8"/><circle cx="20" cy="15" r="3" fill="${TOM}"/><path d="M17 12 q3 -4 6 0" stroke="${LEAF2}" stroke-width="2" fill="none"/>`,
  ];

  const cafe = [
    // 1 Grano
    `<ellipse cx="20" cy="20" rx="8" ry="11" fill="${BEAN}" transform="rotate(-20 20 20)"/><path d="M20 10 q3 10 0 20" stroke="#8b5e3c" stroke-width="2" fill="none" transform="rotate(-20 20 20)"/>`,
    // 2 Molido
    `<path d="M6 14 h28 v4 l-3 14 h-22 l-3 -14 Z" fill="${CREAM}"/><path d="M9 18 h22 l-2 12 h-18 Z" fill="${COFFEE}"/><g fill="${BEAN}"><circle cx="14" cy="22" r="1.3"/><circle cx="20" cy="25" r="1.3"/><circle cx="26" cy="22" r="1.3"/><circle cx="17" cy="27" r="1.3"/><circle cx="23" cy="20" r="1.3"/></g>`,
    // 3 Espresso
    `<path d="M11 18 h16 v8 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M27 20 h3 a3 3 0 0 1 0 6 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="13" y="20" width="12" height="3" fill="${COFFEE}"/><rect x="9" y="30" width="20" height="2" rx="1" fill="#dcd0bb"/>`,
    // 4 Latte
    `<path d="M12 10 h16 v18 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 14 h3 a3 3 0 0 1 0 8 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="12" width="12" height="4" fill="${MILK}"/><path d="M17 14 q3 -3 6 0 q-3 3 -6 0" fill="${COFFEE}"/>`,
    // 5 Capuchino
    `<path d="M10 16 h20 v10 q0 4 -4 4 h-12 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M30 18 h3 a3 3 0 0 1 0 6 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><path d="M11 16 h18 q-2 -6 -9 -6 q-7 0 -9 6 Z" fill="${MILK}"/><circle cx="17" cy="13" r="1.3" fill="${COFFEE}"/><circle cx="23" cy="12" r="1.3" fill="${COFFEE}"/>`,
    // 6 Affogato
    `<path d="M12 12 h16 l-2 18 h-12 Z" fill="#dde7ee" opacity=".7"/><path d="M13 20 h14 l-1 10 h-12 Z" fill="${COFFEE}"/><circle cx="20" cy="16" r="6" fill="${MILK}"/><rect x="22" y="4" width="2" height="12" fill="#dcd0bb" transform="rotate(15 23 10)"/>`,
    // 7 Carta de cafés
    `<rect x="9" y="7" width="22" height="26" rx="2" fill="${INK}"/><rect x="11" y="9" width="18" height="22" fill="${COFFEE}"/><g stroke="${CREAM}" stroke-width="1.5"><line x1="14" y1="15" x2="26" y2="15"/><line x1="14" y1="20" x2="24" y2="20"/><line x1="14" y1="25" x2="25" y2="25"/></g><circle cx="20" cy="11" r="1.2" fill="${GOLD}"/>`,
  ];

  const dulce = [
    // 1 Azúcar
    `<g fill="${SUGAR}" stroke="#e2d6c2" stroke-width="1"><rect x="10" y="16" width="9" height="9" rx="1.5"/><rect x="21" y="16" width="9" height="9" rx="1.5"/><rect x="15" y="9" width="9" height="9" rx="1.5"/></g>`,
    // 2 Caramelo
    `<ellipse cx="20" cy="20" rx="8" ry="6" fill="${GOLD}"/><path d="M12 20 l-6 -4 v8 Z M28 20 l6 -4 v8 Z" fill="${GOLD}"/><path d="M16 18 q4 2 8 0" stroke="#c88a4a" stroke-width="1.5" fill="none"/>`,
    // 3 Galleta
    `<circle cx="20" cy="20" r="11" fill="${CRUST}"/><g fill="${CHOC}"><circle cx="15" cy="17" r="2"/><circle cx="23" cy="15" r="2"/><circle cx="25" cy="23" r="2"/><circle cx="17" cy="25" r="2"/></g>`,
    // 4 Brownie
    `<rect x="9" y="14" width="22" height="16" rx="2" fill="${CHOC}"/><rect x="9" y="14" width="22" height="5" rx="2" fill="#73482c"/><g fill="#a5783f"><circle cx="15" cy="24" r="1.5"/><circle cx="24" cy="26" r="1.5"/></g>`,
    // 5 Macaron
    `<ellipse cx="20" cy="14" rx="12" ry="6" fill="${LEAF}"/><rect x="8" y="14" width="24" height="5" fill="${LEAF}"/><rect x="9" y="19" width="22" height="4" fill="${CREAM}"/><rect x="8" y="23" width="24" height="4" fill="${LEAF}"/><ellipse cx="20" cy="27" rx="12" ry="5" fill="${LEAF2}"/>`,
    // 6 Tiramisú
    `<rect x="9" y="12" width="22" height="18" rx="2" fill="${CRUST}"/><rect x="9" y="12" width="22" height="5" rx="2" fill="${CHOC}"/><rect x="9" y="20" width="22" height="4" fill="${MILK}"/><g fill="${CHOC}" opacity=".6"><circle cx="14" cy="14" r=".8"/><circle cx="20" cy="15" r=".8"/><circle cx="26" cy="14" r=".8"/></g>`,
    // 7 Mesa dulce
    `<rect x="6" y="26" width="28" height="3" rx="1.5" fill="#a5783f"/><rect x="12" y="20" width="16" height="6" rx="1" fill="${CREAM}"/><circle cx="12" cy="18" r="4" fill="${ROSE}"/><circle cx="20" cy="15" r="5" fill="${PINK}"/><circle cx="28" cy="18" r="4" fill="${GOLD}"/><circle cx="20" cy="11" r="1.5" fill="${TOM}"/>`,
  ];

  const ALL = { pan, huerta, cafe, dulce };

  function svg(chain, level) {
    const body = ALL[chain] && ALL[chain][level - 1];
    if (!body) return '';
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  return { svg };
})();
