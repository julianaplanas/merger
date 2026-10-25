# Bistró

Merge game de cocina hecho a medida: sin publicidad, sin monetización, y pensado para jugarse solo en los ratos muertos del día laboral.

- Tablero 7×9, 4 cadenas de 7 niveles, fusión 2 → 1.
- 120 de energía por día, 6 pedidos. Entregar los 6 cierra el día.
- Abre de 8:00 a 19:00 de lunes a viernes. Reset a las 7:00.
- Sesiones: aviso a los 8 min seguidos, cierre a los 12, pausa de 20.
- Contador de minutos jugados hoy y esta semana, siempre visible.
- Sin backend: todo en `localStorage`. Instalable como PWA.

## Correr en local

Cualquier servidor estático sirve:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`. En `localhost` el horario no aplica (modo desarrollo) y hay un helper en consola: `bistro.reset()` borra el estado.

## Publicar

GitHub Pages desde la rama `main`, carpeta raíz. No hay build.

## Archivos

- `index.html` — estructura
- `style.css` — estilos (paleta cálida, una tonalidad por cadena)
- `app.js` — toda la lógica: estado, reset, horario, sesiones, tablero, pedidos, ajustes
- `local.js` — la escena del local: 30 piezas en SVG que se desbloquean cada 15 estrellas
- `sw.js` + `manifest.json` + `icon.svg` — PWA
