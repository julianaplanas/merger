/* Contenido del juego: ingredientes, estaciones, recetas y desbloqueos.
   Todo lo que es "qué hay" vive acá; "cómo funciona" vive en app.js. */

window.DATA = (() => {

  // ---------- Generadores e ingredientes ----------
  // Cada generador produce una cadena de 4 niveles. id de ítem = `${cadena}${nivel}`.
  const CHAINS = {
    pan:    { name: 'Panadería', icon: '🥖', color: '#d9a066', bg: '#f0d8b0', items: ['Harina', 'Masa', 'Pan', 'Baguette'] },
    huerta: { name: 'Huerta',    icon: '🌱', color: '#7f9c6a', bg: '#cfdcc1', items: ['Semilla', 'Brote', 'Tomate', 'Ensalada'] },
    cafe:   { name: 'Café',      icon: '☕', color: '#8b5e3c', bg: '#dcc2a8', items: ['Grano', 'Molido', 'Espresso', 'Latte'] },
    dulce:  { name: 'Dulce',     icon: '🍬', color: '#c97b8e', bg: '#efcdd6', items: ['Azúcar', 'Caramelo', 'Galleta', 'Brownie'] },
    lacteo: { name: 'Lácteos',   icon: '🥛', color: '#8fa7b8', bg: '#dde6ec', items: ['Leche', 'Nata', 'Queso', 'Mantequilla'] },
    fruta:  { name: 'Fruta',     icon: '🍓', color: '#d9553f', bg: '#f2d0c8', items: ['Manzana', 'Fresa', 'Limón', 'Mermelada'] },
    huevo:  { name: 'Huevos',    icon: '🥚', color: '#e4b45a', bg: '#f6e7c2', items: ['Huevo', 'Huevo batido', 'Tortilla francesa', 'Merengue'] },
    choco:  { name: 'Chocolate', icon: '🍫', color: '#5a3b26', bg: '#d8c7bb', items: ['Cacao', 'Chocolate', 'Trufa', 'Ganache'] },
    especia:{ name: 'Especias',  icon: '🌶', color: '#b4452c', bg: '#eccdc1', items: ['Sal', 'Pimienta', 'Albahaca', 'Pimentón'] },
  };
  const LEVELS = 4;

  // ---------- Estaciones ----------
  const STATIONS = {
    tabla:     { name: 'Tabla',     icon: '🔪', color: '#a5783f', slots: 3 },
    horno:     { name: 'Horno',     icon: '🔥', color: '#c9643f', slots: 3 },
    sarten:    { name: 'Sartén',    icon: '🍳', color: '#5d6b78', slots: 3 },
    licuadora: { name: 'Licuadora', icon: '🥤', color: '#7f9c6a', slots: 3 },
    cafetera:  { name: 'Cafetera',  icon: '☕', color: '#3d3129', slots: 3 },
    heladera:  { name: 'Heladera',  icon: '🧊', color: '#8fa7b8', slots: 3 },
  };

  // ---------- Platos ----------
  // Los platos tienen un "tier" (1–3) que mide profundidad. Se fusionan entre sí por familia:
  // dos platos iguales → su versión "grande" (merge), que vale como plato de tier+1 para pedidos.
  const DISHES = {};
  const D = (id, name, tier, color, big) => { DISHES[id] = { id, name, tier, color, big }; };

  // ---------- Recetas ----------
  // { station, in: [ids de ingrediente o plato], out: id de plato }
  const RECIPES = [];
  const R = (station, inp, out) => RECIPES.push({ station, in: inp, out });

  const TERRA = '#c9643f', OLIVE = '#7f9c6a', ROSE = '#c97b8e', GOLD = '#e4b45a', BROWN = '#8b5e3c', SLATE = '#5d6b78', CHOC = '#5a3b26';

  // --- Tabla (bocadillos, ensaladas, crudo) ---
  D('tostada', 'Tostada con tomate', 1, TERRA);        R('tabla', ['pan3', 'huerta3'], 'tostada');
  D('bocadillo', 'Bocadillo', 1, BROWN);               R('tabla', ['pan4', 'lacteo3'], 'bocadillo');
  D('caprese', 'Ensalada caprese', 1, OLIVE);          R('tabla', ['huerta3', 'lacteo3'], 'caprese');
  D('pandequeso', 'Pan con mantequilla', 1, GOLD);     R('tabla', ['pan3', 'lacteo4'], 'pandequeso');
  D('fruitbowl', 'Bol de fruta', 1, ROSE);             R('tabla', ['fruta1', 'fruta2'], 'fruitbowl');
  D('panyqueso', 'Pan con queso', 1, GOLD);            R('tabla', ['pan2', 'lacteo2'], 'panyqueso');
  D('ensaladaverde', 'Ensalada verde', 1, OLIVE);      R('tabla', ['huerta2', 'huerta3'], 'ensaladaverde');
  D('tomateconsal', 'Tomate aliñado', 1, TERRA);       R('tabla', ['huerta3', 'especia1'], 'tomateconsal');
  D('pesto', 'Pesto', 1, OLIVE);                       R('tabla', ['especia3', 'lacteo3'], 'pesto');
  D('bruschetta', 'Bruschetta', 2, TERRA);             R('tabla', ['tostada', 'especia3'], 'bruschetta');
  D('ensaladapasta', 'Ensalada de pasta', 2, OLIVE);   R('tabla', ['huerta4', 'pesto'], 'ensaladapasta');
  D('clubsand', 'Club sándwich', 2, BROWN);            R('tabla', ['bocadillo', 'huevo3'], 'clubsand');
  D('tartar', 'Tartar de fresa', 2, ROSE);             R('tabla', ['fruta2', 'especia2'], 'tartar');
  D('tablaquesos', 'Tabla de quesos', 3, GOLD);        R('tabla', ['lacteo3', 'fruta4'], 'tablaquesos');

  // --- Horno ---
  D('pizza', 'Pizza margarita', 1, TERRA);             R('horno', ['pan2', 'huerta3', 'lacteo3'], 'pizza');
  D('focaccia', 'Focaccia', 1, OLIVE);                 R('horno', ['pan2', 'especia3'], 'focaccia');
  D('galletamantequilla', 'Galletas de mantequilla', 1, GOLD); R('horno', ['dulce3', 'lacteo4'], 'galletamantequilla');
  D('tartamanzana', 'Tarta de manzana', 1, GOLD);      R('horno', ['pan2', 'fruta1'], 'tartamanzana');
  D('quiche', 'Quiche', 1, GOLD);                      R('horno', ['pan2', 'huevo2', 'lacteo3'], 'quiche');
  D('brownieextra', 'Brownie de chocolate', 1, CHOC);  R('horno', ['dulce4', 'choco2'], 'brownieextra');
  D('empanada', 'Empanada', 1, BROWN);                 R('horno', ['pan2', 'huevo3'], 'empanada');
  D('pizzacuatro', 'Pizza cuatro quesos', 2, TERRA);   R('horno', ['pizza', 'lacteo3'], 'pizzacuatro');
  D('lasagna', 'Lasaña', 2, TERRA);                    R('horno', ['pan2', 'huerta3', 'lacteo2'], 'lasagna');
  D('tartaqueso', 'Tarta de queso', 2, ROSE);          R('horno', ['dulce3', 'lacteo3', 'huevo1'], 'tartaqueso');
  D('croissant', 'Croissant', 2, GOLD);                R('horno', ['pan2', 'lacteo4'], 'croissant');
  D('painchoc', 'Pain au chocolat', 2, CHOC);          R('horno', ['croissant', 'choco2'], 'painchoc');
  D('tartafresa', 'Tarta de fresas', 2, ROSE);         R('horno', ['pan2', 'fruta2', 'lacteo2'], 'tartafresa');
  D('merenguehorno', 'Merengue horneado', 2, GOLD);    R('horno', ['huevo4', 'dulce1'], 'merenguehorno');
  D('souffle', 'Soufflé', 3, GOLD);                    R('horno', ['huevo4', 'choco2', 'lacteo2'], 'souffle');
  D('tartalimon', 'Tarta de limón', 3, GOLD);          R('horno', ['pan2', 'fruta3', 'huevo4'], 'tartalimon');
  D('sachertorte', 'Sacher', 3, CHOC);                 R('horno', ['brownieextra', 'fruta4', 'choco4'], 'sachertorte');
  D('pavlova', 'Pavlova', 3, ROSE);                    R('horno', ['merenguehorno', 'lacteo2', 'fruta2'], 'pavlova');

  // --- Sartén ---
  D('tortillapatata', 'Tortilla de patata', 1, GOLD);  R('sarten', ['huevo2', 'huerta2'], 'tortillapatata');
  D('huevosfritos', 'Huevos fritos', 1, GOLD);         R('sarten', ['huevo1', 'especia1'], 'huevosfritos');
  D('tostadafrancesa', 'Tostada francesa', 1, BROWN);  R('sarten', ['pan3', 'huevo2'], 'tostadafrancesa');
  D('salteado', 'Salteado de verduras', 1, OLIVE);     R('sarten', ['huerta3', 'especia2'], 'salteado');
  D('crepe', 'Crep', 1, GOLD);                         R('sarten', ['pan1', 'huevo2'], 'crepe');
  D('crepechoco', 'Crep de chocolate', 2, CHOC);       R('sarten', ['crepe', 'choco2'], 'crepechoco');
  D('crepemermelada', 'Crep de mermelada', 2, ROSE);   R('sarten', ['crepe', 'fruta4'], 'crepemermelada');
  D('shakshuka', 'Shakshuka', 2, TERRA);               R('sarten', ['huevo1', 'huerta3', 'especia4'], 'shakshuka');
  D('revueltotrufa', 'Revuelto', 2, GOLD);             R('sarten', ['huevo2', 'lacteo4'], 'revueltotrufa');
  D('pancakes', 'Tortitas', 2, GOLD);                  R('sarten', ['crepe', 'dulce2'], 'pancakes');
  D('tortillaqueso', 'Tortilla de queso', 2, GOLD);    R('sarten', ['tortillapatata', 'lacteo3'], 'tortillaqueso');
  D('crepesuzette', 'Crep Suzette', 3, GOLD);          R('sarten', ['crepe', 'fruta3', 'dulce2'], 'crepesuzette');

  // --- Licuadora ---
  D('batidofresa', 'Batido de fresa', 1, ROSE);        R('licuadora', ['fruta2', 'lacteo1'], 'batidofresa');
  D('limonada', 'Limonada', 1, GOLD);                  R('licuadora', ['fruta3', 'dulce1'], 'limonada');
  D('gazpacho', 'Gazpacho', 1, TERRA);                 R('licuadora', ['huerta3', 'especia1'], 'gazpacho');
  D('zumo', 'Zumo de manzana', 1, GOLD);               R('licuadora', ['fruta1', 'fruta1'], 'zumo');
  D('smoothieverde', 'Smoothie verde', 1, OLIVE);      R('licuadora', ['huerta2', 'fruta1'], 'smoothieverde');
  D('batidochoco', 'Batido de chocolate', 2, CHOC);    R('licuadora', ['choco2', 'lacteo1'], 'batidochoco');
  D('milkshake', 'Milkshake', 2, ROSE);                R('licuadora', ['batidofresa', 'lacteo2'], 'milkshake');
  D('salmorejo', 'Salmorejo', 2, TERRA);               R('licuadora', ['gazpacho', 'pan3'], 'salmorejo');
  D('frappe', 'Frappé', 2, BROWN);                     R('licuadora', ['cafe3', 'lacteo1'], 'frappe');
  D('sorbete', 'Sorbete de limón', 3, GOLD);           R('licuadora', ['limonada', 'huevo4'], 'sorbete');

  // --- Cafetera ---
  D('cortado', 'Cortado', 1, BROWN);                   R('cafetera', ['cafe3', 'lacteo1'], 'cortado');
  D('capuchino', 'Capuchino', 1, BROWN);               R('cafetera', ['cafe4', 'lacteo2'], 'capuchino');
  D('chocolatecaliente', 'Chocolate caliente', 1, CHOC); R('cafetera', ['choco2', 'lacteo1'], 'chocolatecaliente');
  D('tedelimon', 'Té con limón', 1, GOLD);             R('cafetera', ['especia3', 'fruta3'], 'tedelimon');
  D('mocha', 'Mocha', 2, CHOC);                        R('cafetera', ['cafe3', 'choco2', 'lacteo1'], 'mocha');
  D('affogato', 'Affogato', 2, BROWN);                 R('cafetera', ['cafe3', 'helado'], 'affogato');
  D('caramelmacchiato', 'Caramel macchiato', 2, GOLD); R('cafetera', ['capuchino', 'dulce2'], 'caramelmacchiato');
  D('irishcoffee', 'Café vienés', 3, BROWN);           R('cafetera', ['cafe4', 'lacteo2', 'choco1'], 'irishcoffee');

  // --- Heladera ---
  D('helado', 'Helado de nata', 1, ROSE);              R('heladera', ['lacteo2', 'dulce1'], 'helado');
  D('yogurfruta', 'Yogur con fruta', 1, ROSE);         R('heladera', ['lacteo1', 'fruta2'], 'yogurfruta');
  D('mousse', 'Mousse de chocolate', 1, CHOC);         R('heladera', ['choco2', 'lacteo2'], 'mousse');
  D('panacotta', 'Panna cotta', 2, ROSE);              R('heladera', ['lacteo2', 'dulce2', 'fruta4'], 'panacotta');
  D('heladochoco', 'Helado de chocolate', 2, CHOC);    R('heladera', ['helado', 'choco2'], 'heladochoco');
  D('tiramisu', 'Tiramisú', 2, CHOC);                  R('heladera', ['dulce3', 'cafe3', 'lacteo2'], 'tiramisu');
  D('trufas', 'Trufas', 2, CHOC);                      R('heladera', ['choco3', 'choco3'], 'trufas');
  D('cheesecakefrio', 'Cheesecake de fresa', 3, ROSE); R('heladera', ['tartaqueso', 'fruta2'], 'cheesecakefrio');
  D('semifreddo', 'Semifreddo', 3, ROSE);              R('heladera', ['helado', 'huevo4', 'choco2'], 'semifreddo');
  D('bombon', 'Bombón helado', 3, CHOC);               R('heladera', ['helado', 'choco4'], 'bombon');

  // ---------- Desbloqueos ----------
  // Lista única ordenada. Cada entrada: { stars, kind: 'gen'|'station'|'deco', id }.
  // Las recetas se desbloquean solas cuando tenés la estación y los ingredientes existen.
  const UNLOCKS = [
    { stars: 0,  kind: 'gen', id: 'pan' },
    { stars: 0,  kind: 'gen', id: 'huerta' },
    { stars: 0,  kind: 'gen', id: 'lacteo' },
    { stars: 0,  kind: 'station', id: 'tabla' },
    { stars: 4,  kind: 'deco', id: 0 },
    { stars: 8,  kind: 'station', id: 'horno' },
    { stars: 12, kind: 'deco', id: 1 },
    { stars: 16, kind: 'gen', id: 'huevo' },
    { stars: 20, kind: 'deco', id: 2 },
    { stars: 24, kind: 'station', id: 'sarten' },
    { stars: 28, kind: 'deco', id: 3 },
    { stars: 32, kind: 'gen', id: 'fruta' },
    { stars: 36, kind: 'deco', id: 4 },
    { stars: 42, kind: 'station', id: 'licuadora' },
    { stars: 48, kind: 'deco', id: 5 },
    { stars: 54, kind: 'gen', id: 'dulce' },
    { stars: 60, kind: 'deco', id: 6 },
    { stars: 66, kind: 'gen', id: 'especia' },
    { stars: 72, kind: 'deco', id: 7 },
    { stars: 80, kind: 'station', id: 'heladera' },
    { stars: 88, kind: 'deco', id: 8 },
    { stars: 96, kind: 'gen', id: 'cafe' },
    { stars: 104, kind: 'deco', id: 9 },
    { stars: 112, kind: 'station', id: 'cafetera' },
    { stars: 120, kind: 'deco', id: 10 },
    { stars: 130, kind: 'gen', id: 'choco' },
    { stars: 140, kind: 'deco', id: 11 },
    { stars: 150, kind: 'board', id: 'wide' },   // tablero pasa a 7×9
  ];
  // El resto de la decoración (12–29) sigue cada 12 estrellas después de la última entrada.
  for (let i = 12; i < 30; i++) UNLOCKS.push({ stars: 150 + (i - 11) * 12, kind: 'deco', id: i });

  // Posiciones fijas en el tablero 6×8 (fila, col). Filas 6–7: generadores. Fila 0: estaciones.
  const GEN_POS = { pan: [7, 0], huerta: [7, 1], lacteo: [7, 2], huevo: [7, 3], fruta: [7, 4], dulce: [7, 5], especia: [6, 0], cafe: [6, 5], choco: [6, 1] };
  const STATION_POS = { tabla: [0, 0], horno: [0, 5], sarten: [0, 2], licuadora: [0, 1], heladera: [0, 4], cafetera: [0, 3] };

  // ---------- Utilidades ----------
  function isIngredient(id) { return /^[a-z]+[1-4]$/.test(id) && CHAINS[id.slice(0, -1)]; }
  function ingName(id) { const ch = CHAINS[id.slice(0, -1)]; return ch.items[+id.slice(-1) - 1]; }
  function itemName(id) { return isIngredient(id) ? ingName(id) : (DISHES[id] ? DISHES[id].name : id); }
  function recipeFor(out) { return RECIPES.find(r => r.out === out); }
  function recipesAt(station) { return RECIPES.filter(r => r.station === station); }

  // Costo en toques de generador de un ítem (profundidad real).
  function cost(id) {
    if (isIngredient(id)) return 2 ** (+id.slice(-1) - 1);
    const r = recipeFor(id);
    return r ? r.in.reduce((s, i) => s + cost(i), 0) : 0;
  }

  // Generadores necesarios para hacer un ítem.
  function gensFor(id, acc = new Set()) {
    if (isIngredient(id)) acc.add(id.slice(0, -1));
    else { const r = recipeFor(id); if (r) r.in.forEach(i => gensFor(i, acc)); }
    return acc;
  }
  function stationsFor(id, acc = new Set()) {
    const r = recipeFor(id);
    if (r) { acc.add(r.station); r.in.forEach(i => stationsFor(i, acc)); }
    return acc;
  }

  return { CHAINS, LEVELS, STATIONS, DISHES, RECIPES, UNLOCKS, GEN_POS, STATION_POS,
           isIngredient, ingName, itemName, recipeFor, recipesAt, cost, gensFor, stationsFor };
})();
