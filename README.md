# Bistró

Merge game de cocina hecho a medida: sin publicidad, sin monetización, y pensado para jugarse solo en los ratos muertos del día laboral.

- Tablero 6×8 (7×9 más adelante). 9 generadores de ingredientes (4 niveles cada uno), 6 estaciones (tabla, horno, sartén, licuadora, cafetera, heladera) y 72 recetas.
- Las estaciones combinan ingredientes al instante, sin timers ni costo. Solo generar gasta energía.
- Generadores, estaciones y decoración se desbloquean con estrellas en una lista única (`data.js`).
- 120 de energía por día, 6 pedidos de platos. Entregar los 6 cierra el día.
- Abre de 8:00 a 19:00 de lunes a viernes. Reset a las 7:00.
- Sesiones: aviso a los 8 min seguidos, cierre a los 12, pausa de 20.
- Contador de minutos jugados hoy y esta semana, siempre visible.
- Sin backend: todo en `localStorage`. Instalable como PWA.

## Correr en local

Cualquier servidor estático sirve:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`. En `localhost` el horario no aplica (modo desarrollo) y hay un helper en consola: `bistro.reset()` borra el estado y `bistro.cheat(n)` pone n estrellas y aplica los desbloqueos.

## Publicar

GitHub Pages desde la rama `main`, carpeta raíz. No hay build.

## Archivos

- `index.html` — estructura
- `style.css` — estilos (paleta cálida, una tonalidad por cadena)
- `app.js` — toda la lógica: estado, reset, horario, sesiones, tablero, estaciones, pedidos, desbloqueos, ajustes
- `data.js` — contenido: ingredientes, estaciones, recetas y lista de desbloqueos
- `icons.js` — iconos de ingredientes y platos en SVG
- `local.js` — la escena del local: 30 piezas en SVG que se desbloquean cada 15 estrellas
- `sw.js` + `manifest.json` + `icon.svg` — PWA
