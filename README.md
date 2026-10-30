# Salón

Cuatro juegos casuales en una PWA, sin publicidad, sin compras ni notificaciones.

- **Bistró** (`/merge`): merge game de cocina. Ingredientes, estaciones, 72 recetas, mesas de clientes y un local que se decora.
- **Bloques** (`/blocks`): deslizar piezas de ladrillos hasta la salida de su color (estilo Block Jam). Niveles construidos al revés, siempre resolubles.
- **Colores** (`/sort`): ordenar bloques por color vertiendo entre tubos. Niveles infinitos, generados y verificados como resolubles.
- **Servicio** (`/diner`): atender mesas. Sentar, tomar pedido, cocinar, servir, cobrar. Días de 90 s, estrellas y mejoras.

Común a los tres: contador honesto de minutos jugados (hoy y esta semana) y, en Ajustes, un horario de juego y un límite de sesión **opcionales**, apagados por defecto.

## Correr en local

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`. En localhost hay helpers en consola: `bistro.*`, `sort.*`, `diner.*` (cada uno con `reset()`).

## Publicar

GitHub Pages desde `main`, carpeta raíz. Sin build.

## Archivos

- `index.html` — el hub
- `common.css`, `common.js` — estilos base, barra superior, minutos, ajustes y límites
- `art.js` — arte compartido en SVG: avatares de clientes, estaciones, iconos
- `merge/` — Bistró (`app.js` lógica, `data.js` contenido, `icons.js`, `local.js`)
- `blocks/` — Bloques (`blocks.js` incluye generador con solución registrada)
- `sort/` — Colores (`sort.js` incluye generador y solver)
- `diner/` — Servicio (`diner.js`)
- `sw.js`, `manifest.json`, `icon.svg` — PWA
