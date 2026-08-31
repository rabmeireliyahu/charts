# Descarga de audios para oír sin internet (para Jaime)

Archivo: `descargas_offline.js` (mismo repo, raíz). Sin dependencias, ~120 líneas.

## Qué hace
Guarda el mp3 completo en el dispositivo (IndexedDB) y luego lo reproduce desde ahí,
sin red. Funciona en Android (TWA/Chrome), iOS (WKWebView/Safari) y escritorio.
Los audios están en Archive.org, que permite CORS, así que `fetch` funciona directo.

## Integración (3 líneas)
```html
<script src="https://rabmeireliyahu.github.io/charts/descargas_offline.js"></script>
```
```js
// al pintar un shiur:
const id  = 'shawat|sanhedrin|23';                       // cualquier id único y estable
audio.src = await OtzarDescargas.srcPara(urlMp3, id);   // offline si ya está, si no la URL
OtzarDescargas.boton(divBotones, urlMp3, id);            // botón Descargar / Descargado ✓ · Quitar
```

## API
- `srcPara(url, id)` → URL local si está descargado, si no la URL original
- `guardar(url, id, onProgreso(p, bytes))` → descarga y guarda
- `existe(id)`, `borrar(id)`, `lista()`, `espacio()`
- `boton(contenedor, url, id, textos?)` → botón con estados y progreso

## Detalles
- Pide almacenamiento persistente (`navigator.storage.persist`) para que el sistema no lo borre.
- Cada mp3 pesa 15–30 MB; conviene mostrar `espacio()` en una pantalla "Mis descargas" con `lista()`.
- Estilo: el botón lleva clase `otzar-descarga`, dale el look de la app en CSS.
- Sugerencia: botón "Descargar toda la masejta" = bucle de `guardar` sobre `shawat_shas.json`.
