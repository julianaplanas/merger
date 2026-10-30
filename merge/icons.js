/* Iconos de los ítems. Uno por cadena y nivel, en SVG plano, viewBox 40×40.
   Mismo estilo que el local: formas simples, sin brillos. */

window.ICONS = (() => {
  const CREAM = '#fbf6ec', INK = '#3d3129', CRUST = '#c88a4a', CRUST2 = '#a56b32', FLOUR = '#f3e6cf',
        LEAF = '#7f9c6a', LEAF2 = '#5f7d4c', TOM = '#d9553f', BEAN = '#5a3b26', COFFEE = '#8b5e3c',
        MILK = '#f6efe3', CUP = '#efe3cf', ROSE = '#c97b8e', PINK = '#e9b6c3', CHOC = '#5a3b26', SUGAR = '#fdfaf3',
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

  // ---------- Cadenas nuevas (v2) ----------
  const WHITE = '#fdfaf3', BLUE = '#8fa7b8', YEL = '#f3cf6a', RED = '#d9553f', SLATE_ = '#5d6b78';
  const lacteo = [
    // Leche
    `<path d="M14 10 h12 v4 l2 3 v14 h-16 v-14 l2 -3 Z" fill="${WHITE}" stroke="#dcd0bb" stroke-width="1"/><rect x="14" y="10" width="12" height="4" fill="${BLUE}"/>`,
    // Nata
    `<path d="M10 22 h20 v6 q-10 4 -20 0 Z" fill="${CUP}"/><path d="M12 22 q8 -14 16 0 Z" fill="${WHITE}"/><circle cx="20" cy="14" r="3" fill="${WHITE}"/>`,
    // Queso
    `<path d="M8 28 L32 28 L32 18 L8 24 Z" fill="${YEL}"/><path d="M8 24 L32 18 L28 12 L8 18 Z" fill="#f8dc8a"/><g fill="#e4b45a"><circle cx="16" cy="24" r="1.8"/><circle cx="24" cy="22" r="1.5"/><circle cx="20" cy="27" r="1.2"/></g>`,
    // Mantequilla
    `<rect x="8" y="18" width="24" height="10" rx="2" fill="${YEL}"/><path d="M8 18 L14 12 H32 L32 18 Z" fill="#f8dc8a"/><rect x="8" y="18" width="24" height="3" fill="#e4b45a" opacity=".5"/>`,
  ];
  const fruta = [
    // Manzana
    `<circle cx="20" cy="22" r="10" fill="${RED}"/><circle cx="16" cy="19" r="2" fill="#e87a68"/><rect x="19" y="9" width="2" height="5" fill="${CRUST2}"/><path d="M21 12 q5 -4 6 0 q-4 3 -6 0" fill="${LEAF}"/>`,
    // Fresa
    `<path d="M20 32 q-11 -6 -10 -16 q10 -4 10 0 q0 -4 10 0 q1 10 -10 16 Z" fill="${RED}"/><g fill="#f6e7c2"><circle cx="16" cy="20" r="1"/><circle cx="24" cy="20" r="1"/><circle cx="20" cy="25" r="1"/></g><path d="M14 14 q6 -5 12 0 l-3 3 h-6 Z" fill="${LEAF2}"/>`,
    // Limón
    `<ellipse cx="20" cy="21" rx="11" ry="8" fill="${YEL}"/><circle cx="31" cy="21" r="2" fill="${YEL}"/><circle cx="9" cy="21" r="2" fill="${YEL}"/><ellipse cx="17" cy="18" rx="3" ry="2" fill="#f8dc8a"/>`,
    // Mermelada
    `<path d="M12 14 h16 v16 q0 3 -3 3 h-10 q-3 0 -3 -3 Z" fill="${RED}"/><rect x="11" y="10" width="18" height="5" rx="1" fill="${CRUST2}"/><rect x="14" y="20" width="12" height="7" rx="1" fill="${CREAM}"/>`,
  ];
  const huevo = [
    // Huevo
    `<path d="M20 8 q9 0 9 13 q0 10 -9 10 q-9 0 -9 -10 q0 -13 9 -13 Z" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/>`,
    // Huevo batido
    `<path d="M9 18 h22 l-2 10 h-18 Z" fill="${CREAM}"/><ellipse cx="20" cy="18" rx="11" ry="3" fill="${YEL}"/><circle cx="18" cy="17" r="2" fill="#f8dc8a"/>`,
    // Tortilla francesa
    `<path d="M8 24 q12 -14 24 0 q-12 6 -24 0 Z" fill="${YEL}"/><path d="M10 23 q10 -8 20 0" stroke="#e4b45a" stroke-width="2" fill="none"/>`,
    // Merengue
    `<path d="M10 28 q0 -6 5 -6 q-2 -8 5 -10 q7 2 5 10 q5 0 5 6 Z" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/><path d="M20 12 l2 -4" stroke="#e2d6c2" stroke-width="1.5"/>`,
  ];
  const choco = [
    // Cacao
    `<ellipse cx="20" cy="21" rx="7" ry="11" fill="#8b5e3c"/><g stroke="#5a3b26" stroke-width="1.5"><line x1="16" y1="13" x2="16" y2="29"/><line x1="20" y1="11" x2="20" y2="31"/><line x1="24" y1="13" x2="24" y2="29"/></g>`,
    // Chocolate
    `<rect x="9" y="12" width="22" height="16" rx="2" fill="${CHOC}"/><g stroke="#3d2619" stroke-width="1.2"><line x1="16" y1="12" x2="16" y2="28"/><line x1="24" y1="12" x2="24" y2="28"/><line x1="9" y1="20" x2="31" y2="20"/></g>`,
    // Trufa
    `<circle cx="20" cy="21" r="9" fill="${CHOC}"/><g fill="#73482c"><circle cx="16" cy="18" r="1.5"/><circle cx="23" cy="24" r="1.5"/><circle cx="22" cy="17" r="1"/></g>`,
    // Ganache
    `<path d="M10 16 h20 v10 q0 4 -4 4 h-12 q-4 0 -4 -4 Z" fill="${CHOC}"/><path d="M10 16 q10 6 20 0" stroke="#73482c" stroke-width="2" fill="none"/><path d="M14 20 q3 3 6 0" stroke="#8b5e3c" stroke-width="1.5" fill="none"/>`,
  ];
  const especia = [
    // Sal
    `<path d="M14 12 h12 v18 q0 2 -2 2 h-8 q-2 0 -2 -2 Z" fill="${WHITE}" stroke="#dcd0bb" stroke-width="1"/><rect x="14" y="8" width="12" height="5" rx="1" fill="${BLUE}"/><g fill="${BLUE}"><circle cx="18" cy="10" r=".7"/><circle cx="22" cy="10" r=".7"/></g>`,
    // Pimienta
    `<path d="M14 12 h12 v18 q0 2 -2 2 h-8 q-2 0 -2 -2 Z" fill="${CREAM}" stroke="#dcd0bb" stroke-width="1"/><rect x="14" y="8" width="12" height="5" rx="1" fill="${INK}"/><g fill="${INK}"><circle cx="17" cy="20" r="1.3"/><circle cx="22" cy="23" r="1.3"/><circle cx="20" cy="27" r="1.3"/></g>`,
    // Albahaca
    `<path d="M20 32 v-10" stroke="${LEAF2}" stroke-width="2"/><path d="M20 22 q-10 0 -10 -10 q10 0 10 10 Z" fill="${LEAF}"/><path d="M20 22 q10 0 10 -10 q-10 0 -10 10 Z" fill="${LEAF2}"/><path d="M20 14 q-8 2 -8 10 q8 -2 8 -10" fill="#95b07e"/>`,
    // Pimentón
    `<path d="M14 10 h12 v18 q0 3 -3 3 h-6 q-3 0 -3 -3 Z" fill="${RED}"/><rect x="13" y="8" width="14" height="4" rx="1" fill="#b4452c"/><rect x="17" y="16" width="6" height="8" rx="1" fill="${CREAM}"/>`,
  ];

  // ---------- Platos ----------
  // Dibujados a mano los más comunes; el resto usa un plato genérico con el color de la familia.
  const DISH = {
    // reutilizados de la v1
    croissant: pan[4], tartamanzana: pan[5], pavlova: pan[6],
    gazpacho: huerta[4], salteado: huerta[5], ensaladapasta: huerta[6],
    capuchino: cafe[4], affogato: cafe[5], irishcoffee: cafe[6],
    tiramisu: dulce[5], galletamantequilla: dulce[2],
    // nuevos
    pizza: `<circle cx="20" cy="21" r="12" fill="${CRUST}"/><circle cx="20" cy="21" r="9" fill="${RED}"/><g fill="${CREAM}"><circle cx="16" cy="18" r="2.5"/><circle cx="24" cy="20" r="2.5"/><circle cx="19" cy="25" r="2.5"/></g><circle cx="22" cy="16" r="1.2" fill="${LEAF2}"/>`,
    pizzacuatro: `<circle cx="20" cy="21" r="12" fill="${CRUST}"/><circle cx="20" cy="21" r="9" fill="${YEL}"/><g stroke="${CRUST}" stroke-width="1"><line x1="20" y1="12" x2="20" y2="30"/><line x1="11" y1="21" x2="29" y2="21"/></g><g fill="${CREAM}"><circle cx="16" cy="17" r="2"/><circle cx="24" cy="25" r="2"/></g>`,
    tostada: `<path d="M8 28 v-10 q0 -6 12 -6 q12 0 12 6 v10 Z" fill="${CRUST}"/><path d="M11 20 q9 -6 18 0 v6 h-18 Z" fill="${RED}"/><circle cx="16" cy="23" r="1.3" fill="#e87a68"/><circle cx="24" cy="22" r="1.3" fill="#e87a68"/>`,
    tostadafrancesa: `<path d="M8 28 v-10 q0 -6 12 -6 q12 0 12 6 v10 Z" fill="#d9a066"/><rect x="8" y="24" width="24" height="5" fill="${CRUST2}"/><path d="M10 18 q10 -4 20 0" stroke="${YEL}" stroke-width="3" fill="none"/><rect x="16" y="13" width="8" height="5" rx="1" fill="${YEL}"/>`,
    empanada: `<path d="M8 26 q12 -18 24 0 Z" fill="${CRUST}"/><path d="M8 26 q12 -14 24 0" stroke="${CRUST2}" stroke-width="2" fill="none"/><g stroke="${CRUST2}" stroke-width="1.5"><line x1="12" y1="24" x2="13" y2="21"/><line x1="17" y1="20" x2="18" y2="17"/><line x1="23" y1="17" x2="22" y2="20"/><line x1="28" y1="24" x2="27" y2="21"/></g>`,
    focaccia: `<rect x="7" y="13" width="26" height="16" rx="4" fill="${CRUST}"/><g fill="${CRUST2}"><circle cx="13" cy="19" r="1.5"/><circle cx="20" cy="23" r="1.5"/><circle cx="27" cy="18" r="1.5"/><circle cx="16" cy="25" r="1.5"/><circle cx="24" cy="26" r="1.5"/></g><g fill="${LEAF2}"><circle cx="18" cy="17" r="1.2"/><circle cx="25" cy="23" r="1.2"/></g>`,
    pandequeso: `<path d="M8 28 v-10 q0 -6 12 -6 q12 0 12 6 v10 Z" fill="${CRUST}"/><rect x="12" y="19" width="16" height="4" rx="1" fill="${YEL}"/>`,
    revueltotrufa: `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q3 -8 7 -4 q2 -6 6 -2 q2 -6 6 -2 q3 0 3 8 Z" fill="${YEL}"/><circle cx="23" cy="21" r="1.5" fill="${CHOC}"/>`,
    shakshuka: `<circle cx="20" cy="21" r="12" fill="${SLATE_}"/><circle cx="20" cy="21" r="9" fill="${RED}"/><circle cx="17" cy="19" r="3.5" fill="${WHITE}"/><circle cx="17" cy="19" r="1.5" fill="${YEL}"/><circle cx="24" cy="24" r="3" fill="${WHITE}"/><circle cx="24" cy="24" r="1.3" fill="${YEL}"/>`,
    souffle: `<path d="M11 18 h18 v10 q0 3 -3 3 h-12 q-3 0 -3 -3 Z" fill="#dde7ee"/><path d="M12 18 h16 q0 -10 -8 -10 q-8 0 -8 10 Z" fill="${YEL}"/><path d="M14 14 q6 -4 12 0" stroke="#e4b45a" stroke-width="1.5" fill="none"/>`,
    caramelmacchiato: `<path d="M12 12 h16 v16 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 14 h3 a3 3 0 0 1 0 8 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="14" width="12" height="4" fill="${WHITE}"/><path d="M15 16 l10 0 M16 15 l8 2" stroke="${GOLD}" stroke-width="1.5"/>`,
    painchoc: `<rect x="8" y="14" width="24" height="14" rx="4" fill="${CRUST}"/><g stroke="${CRUST2}" stroke-width="1.5"><line x1="14" y1="14" x2="14" y2="28"/><line x1="26" y1="14" x2="26" y2="28"/></g><rect x="11" y="20" width="18" height="3" fill="${CHOC}"/>`,
    merenguehorno: `<path d="M10 28 q0 -6 5 -6 q-2 -8 5 -10 q7 2 5 10 q5 0 5 6 Z" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/><path d="M14 26 q6 -3 12 0" stroke="#e4b45a" stroke-width="1.5" fill="none"/>`,
    semifreddo: `<rect x="9" y="14" width="22" height="14" rx="2" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/><rect x="9" y="18" width="22" height="4" fill="${CHOC}"/><circle cx="26" cy="12" r="2.5" fill="${RED}"/>`,
    bombon: `<path d="M20 34 L14 18 H26 Z" fill="${CRUST}"/><circle cx="20" cy="16" r="7" fill="${CHOC}"/><path d="M14 14 q6 -8 12 0" fill="${WHITE}"/>`,
    sorbete: `<path d="M11 14 h18 l-2 16 h-14 Z" fill="#dde7ee" opacity=".7"/><circle cx="20" cy="17" r="7" fill="${YEL}"/><circle cx="23" cy="13" r="2" fill="${LEAF}"/>`,
    tartar: `<ellipse cx="20" cy="26" rx="12" ry="4" fill="#dcd0bb"/><path d="M12 25 v-6 q8 -4 16 0 v6 Z" fill="${RED}"/><g fill="#f6e7c2"><circle cx="16" cy="21" r=".8"/><circle cx="22" cy="23" r=".8"/></g><circle cx="21" cy="16" r="1.5" fill="${LEAF2}"/>`,
    fruitbowl: `<path d="M8 20 h24 q-2 10 -12 10 q-10 0 -12 -10 Z" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/><circle cx="14" cy="18" r="4" fill="${RED}"/><circle cx="21" cy="15" r="4" fill="${YEL}"/><circle cx="27" cy="18" r="3.5" fill="${LEAF}"/>`,
    panyqueso: `<path d="M8 28 v-10 q0 -6 12 -6 q12 0 12 6 v10 Z" fill="${CRUST}"/><path d="M12 22 L28 22 L28 17 L12 19 Z" fill="${YEL}"/>`,
    ensaladaverde: `<path d="M7 20 h26 l-3 10 h-20 Z" fill="${CREAM}"/><g><circle cx="13" cy="18" r="4" fill="${LEAF}"/><circle cx="20" cy="15" r="5" fill="#95b07e"/><circle cx="27" cy="18" r="4" fill="${LEAF2}"/></g>`,
    tomateconsal: `<ellipse cx="20" cy="26" rx="12" ry="4" fill="#dcd0bb"/><g fill="${RED}"><circle cx="14" cy="21" r="5"/><circle cx="24" cy="20" r="5"/></g><g fill="${WHITE}"><circle cx="17" cy="17" r=".8"/><circle cx="22" cy="24" r=".8"/><circle cx="27" cy="17" r=".8"/></g>`,
    pesto: `<path d="M12 14 h16 v14 q0 3 -3 3 h-10 q-3 0 -3 -3 Z" fill="${LEAF2}"/><rect x="11" y="10" width="18" height="5" rx="1" fill="${INK}"/><rect x="14" y="19" width="12" height="6" rx="1" fill="${CREAM}"/>`,
    bruschetta: `<path d="M8 28 v-10 q0 -6 12 -6 q12 0 12 6 v10 Z" fill="${CRUST}"/><path d="M11 20 q9 -6 18 0 v6 h-18 Z" fill="${RED}"/><circle cx="20" cy="22" r="2" fill="${LEAF2}"/>`,
    lasagna: `<rect x="8" y="12" width="24" height="18" rx="2" fill="${RED}"/><g fill="${YEL}"><rect x="8" y="16" width="24" height="3"/><rect x="8" y="23" width="24" height="3"/></g><rect x="8" y="12" width="24" height="3" rx="2" fill="${CRUST}"/>`,
    crepesuzette: `<path d="M8 22 q12 -10 24 0 q-12 6 -24 0 Z" fill="${CRUST}"/><path d="M12 21 q8 -6 16 0" stroke="${YEL}" stroke-width="3" fill="none"/><path d="M18 12 q2 -5 4 0 q-2 2 -4 0" fill="${TOM}"/>`,
    tortillaqueso: `<ellipse cx="20" cy="22" rx="12" ry="5" fill="#e4b45a"/><path d="M8 22 q0 -8 12 -8 q12 0 12 8 Z" fill="${YEL}"/><path d="M12 20 q8 -4 16 0" stroke="${WHITE}" stroke-width="2.5" fill="none"/>`,
    bocadillo: `<path d="M6 24 L30 10 q4 -2 5 2 L12 28 q-4 2 -6 -4 Z" fill="${CRUST}"/><path d="M12 22 L28 12" stroke="${YEL}" stroke-width="4"/><path d="M11 24 L27 14" stroke="${LEAF}" stroke-width="2"/>`,
    caprese: `<path d="M7 20 h26 l-3 10 h-20 Z" fill="${CREAM}"/><g><circle cx="13" cy="18" r="4" fill="${RED}"/><circle cx="20" cy="17" r="4" fill="${WHITE}"/><circle cx="27" cy="18" r="4" fill="${RED}"/><circle cx="20" cy="22" r="2" fill="${LEAF2}"/></g>`,
    helado: `<path d="M14 22 L20 34 L26 22 Z" fill="${CRUST}"/><circle cx="20" cy="18" r="7" fill="${WHITE}"/><circle cx="17" cy="15" r="2" fill="${CREAM}"/>`,
    heladochoco: `<path d="M14 22 L20 34 L26 22 Z" fill="${CRUST}"/><circle cx="20" cy="18" r="7" fill="${CHOC}"/>`,
    batidofresa: `<path d="M12 12 h16 l-2 18 h-12 Z" fill="${PINK}"/><path d="M12 12 h16 l-1 4 h-14 Z" fill="${WHITE}"/><rect x="22" y="4" width="2" height="12" fill="${RED}" transform="rotate(15 23 10)"/>`,
    batidochoco: `<path d="M12 12 h16 l-2 18 h-12 Z" fill="#8b5e3c"/><path d="M12 12 h16 l-1 4 h-14 Z" fill="${WHITE}"/><rect x="22" y="4" width="2" height="12" fill="${CHOC}" transform="rotate(15 23 10)"/>`,
    limonada: `<path d="M12 12 h16 l-2 18 h-12 Z" fill="#f8dc8a"/><circle cx="20" cy="20" r="3" fill="${YEL}"/><rect x="24" y="4" width="2" height="12" fill="${BLUE}" transform="rotate(15 25 10)"/>`,
    cortado: `<path d="M12 16 h16 v10 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 18 h3 a3 3 0 0 1 0 6 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="18" width="12" height="3" fill="#a5783f"/>`,
    mocha: `<path d="M12 12 h16 v16 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 14 h3 a3 3 0 0 1 0 8 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="14" width="12" height="4" fill="${WHITE}"/><path d="M15 16 q5 -3 10 0" stroke="${CHOC}" stroke-width="2" fill="none"/>`,
    chocolatecaliente: `<path d="M12 14 h16 v14 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 16 h3 a3 3 0 0 1 0 8 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="16" width="12" height="4" fill="${CHOC}"/><circle cx="18" cy="15" r="2" fill="${WHITE}"/><circle cx="23" cy="15" r="2" fill="${WHITE}"/>`,
    tortillapatata: `<ellipse cx="20" cy="22" rx="12" ry="5" fill="#e4b45a"/><path d="M8 22 q0 -8 12 -8 q12 0 12 8 Z" fill="${YEL}"/><path d="M20 14 v8 M8 22 L20 18" stroke="#e4b45a" stroke-width="1.5"/>`,
    huevosfritos: `<circle cx="20" cy="26" r="2.5" fill="${INK}" opacity=".15"/><path d="M10 22 q2 -10 11 -9 q9 2 9 9 q-1 7 -10 7 q-9 -1 -10 -7 Z" fill="${WHITE}"/><circle cx="21" cy="21" r="4" fill="${YEL}"/>`,
    crepe: `<path d="M8 22 q12 -10 24 0 q-12 6 -24 0 Z" fill="${CRUST}"/><path d="M12 22 q8 -5 16 0" stroke="${CRUST2}" stroke-width="1.5" fill="none"/>`,
    crepechoco: `<path d="M8 22 q12 -10 24 0 q-12 6 -24 0 Z" fill="${CRUST}"/><path d="M12 21 q8 -6 16 0" stroke="${CHOC}" stroke-width="3" fill="none"/>`,
    crepemermelada: `<path d="M8 22 q12 -10 24 0 q-12 6 -24 0 Z" fill="${CRUST}"/><path d="M12 21 q8 -6 16 0" stroke="${RED}" stroke-width="3" fill="none"/>`,
    pancakes: `<ellipse cx="20" cy="28" rx="11" ry="3" fill="${CRUST}"/><ellipse cx="20" cy="24" rx="11" ry="3" fill="#d9a066"/><ellipse cx="20" cy="20" rx="11" ry="3" fill="${CRUST}"/><rect x="16" y="14" width="8" height="5" rx="1" fill="${YEL}"/>`,
    quiche: `<path d="M7 20 h26 v6 q-13 4 -26 0 Z" fill="${CRUST}"/><ellipse cx="20" cy="20" rx="13" ry="4" fill="${YEL}"/><g fill="${LEAF}"><circle cx="14" cy="19" r="1.5"/><circle cx="22" cy="21" r="1.5"/><circle cx="26" cy="18" r="1.5"/></g>`,
    tartaqueso: `<path d="M7 22 h26 v6 q-13 4 -26 0 Z" fill="${CRUST}"/><path d="M7 22 h26 v-6 q-13 -4 -26 0 Z" fill="${WHITE}"/><ellipse cx="20" cy="15" rx="12" ry="3" fill="${CREAM}"/>`,
    cheesecakefrio: `<path d="M7 22 h26 v6 q-13 4 -26 0 Z" fill="${CRUST}"/><path d="M7 22 h26 v-6 q-13 -4 -26 0 Z" fill="${WHITE}"/><ellipse cx="20" cy="15" rx="12" ry="3" fill="${RED}"/>`,
    brownieextra: dulce[3],
    mousse: `<path d="M11 14 h18 l-2 16 h-14 Z" fill="#dde7ee" opacity=".7"/><path d="M12 18 h16 l-1 12 h-14 Z" fill="${CHOC}"/><circle cx="20" cy="16" r="4" fill="${WHITE}"/>`,
    tartafresa: `<path d="M7 22 h26 v6 q-13 4 -26 0 Z" fill="${CRUST}"/><ellipse cx="20" cy="22" rx="13" ry="4" fill="${CREAM}"/><g fill="${RED}"><circle cx="14" cy="20" r="2.5"/><circle cx="20" cy="19" r="2.5"/><circle cx="26" cy="20" r="2.5"/></g>`,
    tartalimon: `<path d="M7 22 h26 v6 q-13 4 -26 0 Z" fill="${CRUST}"/><ellipse cx="20" cy="22" rx="13" ry="4" fill="${YEL}"/><path d="M10 20 q5 -6 10 0 q5 -6 10 0" fill="${WHITE}"/>`,
    sachertorte: `<rect x="8" y="16" width="24" height="14" rx="2" fill="${CHOC}"/><rect x="8" y="22" width="24" height="2" fill="${RED}"/><circle cx="26" cy="13" r="3" fill="${CHOC}"/>`,
    trufas: `<g fill="${CHOC}"><circle cx="14" cy="24" r="5"/><circle cx="26" cy="24" r="5"/><circle cx="20" cy="16" r="5"/></g><g fill="#73482c"><circle cx="13" cy="22" r="1"/><circle cx="25" cy="22" r="1"/><circle cx="19" cy="14" r="1"/></g>`,
    tablaquesos: `<rect x="6" y="22" width="28" height="4" rx="2" fill="#a5783f"/><path d="M8 22 L18 22 L18 16 L8 19 Z" fill="${YEL}"/><circle cx="25" cy="18" r="4" fill="${WHITE}"/><circle cx="30" cy="20" r="2" fill="${RED}"/>`,
    clubsand: `<path d="M8 28 L20 12 L32 28 Z" fill="${CRUST}"/><path d="M11 26 L20 15 L29 26 Z" fill="${LEAF}"/><path d="M13 26 L20 18 L27 26 Z" fill="${YEL}"/><rect x="19" y="8" width="2" height="8" fill="${INK}"/>`,
    smoothieverde: `<path d="M12 12 h16 l-2 18 h-12 Z" fill="${LEAF}"/><path d="M12 12 h16 l-1 4 h-14 Z" fill="#95b07e"/><rect x="24" y="4" width="2" height="12" fill="${WHITE}" transform="rotate(15 25 10)"/>`,
    zumo: `<path d="M12 12 h16 l-2 18 h-12 Z" fill="${YEL}"/><path d="M12 12 h16 l-1 4 h-14 Z" fill="#f8dc8a"/><rect x="24" y="4" width="2" height="12" fill="${RED}" transform="rotate(15 25 10)"/>`,
    milkshake: `<path d="M12 14 h16 l-2 16 h-12 Z" fill="${PINK}"/><path d="M12 14 q8 -10 16 0 Z" fill="${WHITE}"/><circle cx="20" cy="9" r="2" fill="${RED}"/>`,
    frappe: `<path d="M12 14 h16 l-2 16 h-12 Z" fill="#a5783f"/><path d="M12 14 q8 -10 16 0 Z" fill="${WHITE}"/><rect x="24" y="4" width="2" height="12" fill="${LEAF}" transform="rotate(15 25 10)"/>`,
    yogurfruta: `<path d="M11 14 h18 l-2 16 h-14 Z" fill="${WHITE}" stroke="#e2d6c2" stroke-width="1"/><g fill="${RED}"><circle cx="16" cy="18" r="2"/><circle cx="24" cy="20" r="2"/><circle cx="19" cy="24" r="2"/></g>`,
    panacotta: `<path d="M12 24 h16 v4 q-8 3 -16 0 Z" fill="${CREAM}"/><path d="M12 24 h16 v-6 q-8 -4 -16 0 Z" fill="${WHITE}"/><path d="M12 18 q8 -2 16 0" stroke="${RED}" stroke-width="3" fill="none"/>`,
    tedelimon: `<path d="M12 16 h16 v10 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 18 h3 a3 3 0 0 1 0 6 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="18" width="12" height="3" fill="#e4b45a"/><circle cx="23" cy="18" r="2.5" fill="${YEL}"/>`,
  };

  const GENERIC = {
    '#c9643f': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#c9643f"/>`,
    '#7f9c6a': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#7f9c6a"/>`,
    '#c97b8e': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#c97b8e"/>`,
    '#e4b45a': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#e4b45a"/>`,
    '#8b5e3c': `<path d="M12 14 h16 v12 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="${CUP}"/><path d="M28 16 h3 a3 3 0 0 1 0 8 h-3" stroke="${CUP}" stroke-width="2.5" fill="none"/><rect x="14" y="16" width="12" height="4" fill="#8b5e3c"/>`,
    '#5d6b78': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#5d6b78"/>`,
    '#5a3b26': `<ellipse cx="20" cy="25" rx="13" ry="5" fill="#dcd0bb"/><path d="M9 24 q0 -8 11 -8 q11 0 11 8 Z" fill="#5a3b26"/>`,
  };

  const ALL = { pan, huerta, cafe, dulce, lacteo, fruta, huevo, choco, especia };

  // svg('pan2') | svg('pizza') | svg('pan', 2)
  function svg(id, level) {
    let body = '';
    if (level) body = ALL[id] && ALL[id][level - 1];
    else if (/^[a-z]+[1-4]$/.test(id) && ALL[id.slice(0, -1)]) body = ALL[id.slice(0, -1)][+id.slice(-1) - 1];
    else if (DISH[id]) body = DISH[id];
    else if (window.DATA && DATA.DISHES[id]) body = GENERIC[DATA.DISHES[id].color] || GENERIC['#c9643f'];
    if (!body) return '';
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  return { svg };
})();
