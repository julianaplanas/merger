/* El local — escena del bistró. Cada pieza se desbloquea en orden, cada 15 estrellas.
   Escena en SVG plano, viewBox 360×240. Pared hasta y=160, suelo desde 160. */

window.LOCAL = (() => {
  const W = '#f1e4cf', WOOD = '#c89a62', WOOD2 = '#a5783f', OLIVE = '#7f9c6a', TERRA = '#c9643f',
        SLATE = '#5d6b78', INK = '#3d3129', CREAM = '#fbf6ec', ROSE = '#c97b8e', BROWN = '#8b5e3c';

  const base = `
    <rect x="0" y="0" width="360" height="160" fill="${W}"/>
    <rect x="0" y="160" width="360" height="80" fill="#d9c3a3"/>
    <rect x="0" y="156" width="360" height="6" fill="${WOOD2}"/>`;

  // Cada pieza: { name, svg }. El orden es el orden de desbloqueo.
  const pieces = [
    { name: 'Mesa', svg: `
      <rect x="130" y="176" width="100" height="8" rx="3" fill="${WOOD}"/>
      <rect x="176" y="184" width="8" height="36" fill="${WOOD2}"/>
      <rect x="160" y="218" width="40" height="5" rx="2" fill="${WOOD2}"/>` },
    { name: 'Dos sillas', svg: `
      <g fill="${WOOD2}"><rect x="104" y="166" width="6" height="52"/><rect x="104" y="190" width="22" height="6"/><rect x="120" y="196" width="5" height="22"/>
      <rect x="250" y="166" width="6" height="52"/><rect x="234" y="190" width="22" height="6"/><rect x="235" y="196" width="5" height="22"/></g>` },
    { name: 'Lámpara de techo', svg: `
      <line x1="245" y1="0" x2="245" y2="40" stroke="${INK}" stroke-width="2"/>
      <path d="M225 58 L235 40 H255 L265 58 Z" fill="${TERRA}"/><circle cx="245" cy="60" r="5" fill="#f7d98b"/>` },
    { name: 'Planta en maceta', svg: `
      <rect x="66" y="190" width="26" height="30" rx="4" fill="${TERRA}"/>
      <ellipse cx="78" cy="178" rx="15" ry="17" fill="${OLIVE}"/><ellipse cx="70" cy="170" rx="9" ry="11" fill="#95b07e"/>` },
    { name: 'Cuadro', svg: `
      <rect x="60" y="56" width="48" height="36" rx="2" fill="${WOOD2}"/><rect x="64" y="60" width="40" height="28" fill="${CREAM}"/>
      <circle cx="84" cy="74" r="8" fill="${ROSE}"/><rect x="70" y="80" width="28" height="4" fill="${OLIVE}"/>` },
    { name: 'Mostrador', svg: `
      <rect x="0" y="130" width="60" height="90" fill="${WOOD}"/><rect x="0" y="126" width="64" height="8" rx="2" fill="${WOOD2}"/>
      <rect x="6" y="146" width="48" height="60" rx="3" fill="${WOOD2}" opacity=".4"/>` },
    { name: 'Cafetera', svg: `
      <rect x="10" y="100" width="34" height="26" rx="4" fill="${SLATE}"/><rect x="14" y="94" width="26" height="8" rx="2" fill="#7b8794"/>
      <rect x="20" y="118" width="4" height="8" fill="${INK}"/><rect x="30" y="118" width="4" height="8" fill="${INK}"/>` },
    { name: 'Estantería', svg: `
      <g fill="${WOOD2}"><rect x="260" y="40" width="80" height="4"/><rect x="260" y="70" width="80" height="4"/></g>
      <g><rect x="268" y="26" width="10" height="14" fill="${TERRA}"/><rect x="282" y="22" width="8" height="18" fill="${OLIVE}"/><rect x="296" y="28" width="12" height="12" fill="${ROSE}"/>
      <rect x="318" y="24" width="8" height="16" fill="${SLATE}"/><rect x="268" y="58" width="14" height="12" fill="${BROWN}"/><rect x="300" y="54" width="10" height="16" fill="${TERRA}"/></g>` },
    { name: 'Cesta de pan', svg: `
      <path d="M8 126 Q16 110 24 126 Z" fill="${WOOD2}"/><ellipse cx="16" cy="122" rx="10" ry="4" fill="#d9a066"/><ellipse cx="20" cy="118" rx="6" ry="3" fill="#e7b982"/>` },
    { name: 'Cortinas', svg: `
      <rect x="140" y="30" width="80" height="60" fill="#dde7ee"/><rect x="140" y="30" width="80" height="60" fill="none" stroke="${CREAM}" stroke-width="4"/>
      <path d="M138 28 h18 q-4 30 2 64 h-20 Z" fill="${TERRA}"/><path d="M222 28 h-18 q4 30 -2 64 h20 Z" fill="${TERRA}"/>` },
    { name: 'Alfombra', svg: `<ellipse cx="180" cy="226" rx="70" ry="9" fill="${ROSE}" opacity=".7"/><ellipse cx="180" cy="226" rx="50" ry="6" fill="${CREAM}" opacity=".5"/>` },
    { name: 'Pizarra con menú', svg: `
      <rect x="104" y="96" width="30" height="40" rx="2" fill="${INK}"/><rect x="102" y="94" width="34" height="4" fill="${WOOD2}"/>
      <g stroke="${CREAM}" stroke-width="2"><line x1="110" y1="106" x2="128" y2="106"/><line x1="110" y1="114" x2="124" y2="114"/><line x1="110" y1="122" x2="126" y2="122"/></g>` },
    { name: 'Tarta en vitrina', svg: `
      <rect x="44" y="104" width="14" height="22" rx="2" fill="#dde7ee" opacity=".8"/><rect x="46" y="118" width="10" height="6" fill="${ROSE}"/><rect x="47" y="114" width="8" height="4" fill="${CREAM}"/>` },
    { name: 'Flores en la mesa', svg: `
      <rect x="176" y="162" width="8" height="14" fill="#dde7ee"/><circle cx="174" cy="158" r="4" fill="${ROSE}"/><circle cx="182" cy="154" r="4" fill="#f7d98b"/><circle cx="188" cy="160" r="3" fill="${TERRA}"/>` },
    { name: 'Reloj de pared', svg: `
      <circle cx="240" cy="110" r="12" fill="${CREAM}" stroke="${WOOD2}" stroke-width="3"/><line x1="240" y1="110" x2="240" y2="102" stroke="${INK}" stroke-width="2"/><line x1="240" y1="110" x2="246" y2="112" stroke="${INK}" stroke-width="2"/>` },
    { name: 'Baldosas', svg: `
      <g fill="${TERRA}" opacity=".18"><rect x="0" y="162" width="20" height="20"/><rect x="40" y="162" width="20" height="20"/><rect x="80" y="162" width="20" height="20"/><rect x="120" y="162" width="20" height="20"/>
      <rect x="160" y="162" width="20" height="20"/><rect x="200" y="162" width="20" height="20"/><rect x="240" y="162" width="20" height="20"/><rect x="280" y="162" width="20" height="20"/><rect x="320" y="162" width="20" height="20"/>
      <rect x="20" y="182" width="20" height="20"/><rect x="60" y="182" width="20" height="20"/><rect x="100" y="182" width="20" height="20"/><rect x="140" y="182" width="20" height="20"/><rect x="180" y="182" width="20" height="20"/>
      <rect x="220" y="182" width="20" height="20"/><rect x="260" y="182" width="20" height="20"/><rect x="300" y="182" width="20" height="20"/><rect x="340" y="182" width="20" height="20"/></g>` },
    { name: 'Segunda mesa', svg: `
      <rect x="284" y="196" width="60" height="7" rx="3" fill="${WOOD}"/><rect x="311" y="203" width="6" height="24" fill="${WOOD2}"/><rect x="300" y="225" width="28" height="4" rx="2" fill="${WOOD2}"/>` },
    { name: 'Taburetes', svg: `
      <g fill="${WOOD2}"><rect x="290" y="208" width="12" height="4" rx="2"/><rect x="294" y="212" width="4" height="16"/><rect x="326" y="208" width="12" height="4" rx="2"/><rect x="330" y="212" width="4" height="16"/></g>` },
    { name: 'Lámpara de pie', svg: `
      <rect x="269" y="130" width="3" height="88" fill="${INK}"/><rect x="261" y="214" width="20" height="4" rx="2" fill="${INK}"/>
      <path d="M255 132 L261 112 H281 L287 132 Z" fill="#f7d98b"/>` },
    { name: 'Planta en la ventana', svg: `
      <rect x="172" y="84" width="16" height="10" rx="2" fill="${TERRA}"/><ellipse cx="180" cy="80" rx="10" ry="7" fill="${OLIVE}"/>` },
    { name: 'Toldo', svg: `
      <path d="M130 22 H230 L226 32 H134 Z" fill="${TERRA}"/><g fill="${CREAM}"><rect x="146" y="22" width="12" height="10"/><rect x="170" y="22" width="12" height="10"/><rect x="194" y="22" width="12" height="10"/><rect x="218" y="22" width="12" height="10"/></g>` },
    { name: 'Cartel "Bistró"', svg: `
      <rect x="148" y="4" width="64" height="16" rx="4" fill="${INK}"/><text x="180" y="16" text-anchor="middle" font-size="10" font-family="ui-rounded, system-ui, sans-serif" font-weight="700" fill="${CREAM}">BISTRÓ</text>` },
    { name: 'Pizarra de cafés', svg: `
      <rect x="8" y="48" width="40" height="30" rx="2" fill="${INK}"/><g stroke="${CREAM}" stroke-width="2"><line x1="14" y1="58" x2="40" y2="58"/><line x1="14" y1="66" x2="34" y2="66"/></g><circle cx="42" cy="68" r="3" fill="${TERRA}"/>` },
    { name: 'Botellas', svg: `
      <g><rect x="264" y="52" width="6" height="18" rx="2" fill="${OLIVE}"/><rect x="274" y="48" width="6" height="22" rx="2" fill="${SLATE}"/><rect x="284" y="54" width="6" height="16" rx="2" fill="${ROSE}"/><rect x="318" y="50" width="6" height="20" rx="2" fill="${TERRA}"/><rect x="328" y="56" width="6" height="14" rx="2" fill="${BROWN}"/></g>` },
    { name: 'Vitrina de dulces', svg: `
      <rect x="6" y="80" width="44" height="22" rx="3" fill="#dde7ee" opacity=".7" stroke="${WOOD2}" stroke-width="2"/><g><circle cx="16" cy="94" r="4" fill="${ROSE}"/><circle cx="28" cy="94" r="4" fill="#f7d98b"/><circle cx="40" cy="94" r="4" fill="${BROWN}"/></g>` },
    { name: 'Gato dormido', svg: `
      <ellipse cx="150" cy="226" rx="16" ry="7" fill="${INK}"/><circle cx="136" cy="222" r="6" fill="${INK}"/><path d="M131 218 l-2 -5 l5 2 Z M138 216 l3 -5 l2 5 Z" fill="${INK}"/><path d="M166 226 q8 -2 6 -8" stroke="${INK}" stroke-width="3" fill="none"/>` },
    { name: 'Guirnalda de luces', svg: `
      <path d="M60 12 Q120 34 180 12 T300 12" stroke="${INK}" stroke-width="1.5" fill="none"/>
      <g fill="#f7d98b"><circle cx="80" cy="18" r="3"/><circle cx="110" cy="24" r="3"/><circle cx="150" cy="18" r="3"/><circle cx="210" cy="18" r="3"/><circle cx="250" cy="24" r="3"/><circle cx="280" cy="16" r="3"/></g>` },
    { name: 'Perchero', svg: `
      <rect x="348" y="110" width="3" height="110" fill="${INK}"/><rect x="340" y="216" width="18" height="4" rx="2" fill="${INK}"/><path d="M336 118 h26 M340 112 h20" stroke="${INK}" stroke-width="3"/><path d="M338 122 q-6 20 2 32 h8 q6 -14 0 -32 Z" fill="${SLATE}"/>` },
    { name: 'Espejo', svg: `
      <ellipse cx="312" cy="118" rx="18" ry="24" fill="#dde7ee" stroke="${WOOD2}" stroke-width="4"/><path d="M304 104 q6 -4 12 2" stroke="${CREAM}" stroke-width="2" fill="none"/>` },
    { name: 'Un cliente', svg: `
      <circle cx="107" cy="150" r="9" fill="#e7b982"/><path d="M96 160 q11 -8 22 0 v22 h-22 Z" fill="${SLATE}"/><rect x="100" y="152" width="14" height="6" rx="3" fill="${INK}" opacity=".6"/>` },
  ];

  const COST = 15;

  function unlockedCount(stars) { return Math.min(pieces.length, Math.floor(stars / COST)); }

  // n = piezas desbloqueadas (lo decide la lista de desbloqueos en data.js)
  function render(n) {
    n = Math.min(pieces.length, n);
    const svg = `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" width="100%">${base}${pieces.slice(0, n).map(p => p.svg).join('')}</svg>`;
    const next = n < pieces.length ? pieces[n] : null;
    const caption = next
      ? `${n} de ${pieces.length} piezas. Próxima: ${next.name}.`
      : `${pieces.length} de ${pieces.length} piezas. El local está completo.`;
    return { svg, caption, n };
  }

  return { pieces, COST, unlockedCount, render };
})();
