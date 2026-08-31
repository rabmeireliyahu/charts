# Navegador del Shas en la app (para Jaime)

Archivo: `otzar_shas.js` (raíz del repo `charts`). Sin dependencias. No toca el código existente.

## Integración — dos líneas antes de `</body>`
```html
<script src="https://rabmeireliyahu.github.io/charts/descargas_offline.js"></script>
<script src="https://rabmeireliyahu.github.io/charts/otzar_shas.js"></script>
```
Con eso aparece un botón flotante **📚 Shas**. Si prefieres incrustarlo en una pantalla,
pon `<div id="otzar-shas"></div>` donde quieras y ahí se pinta (sin botón flotante).
También: `OtzarShas.abrir()` / `OtzarShas.cerrar()` para engancharlo a tu propio menú.

## Qué hace
- Lista las masejtot del Jajam Moshé Shawat (catálogo vivo: `shawat_shas.json`, hoy 1,724 shiurim / 23 masejtot).
- Al entrar a una masejta: cuadrícula de dafim (ב, ג, ד… con número). 📄 = ese daf tiene tablita.
- Al entrar a un daf: reproductor (mp3 directo de Archive.org), duración, botón **Tablita del daf**
  (PDF de R' Eli Stefansky desde `charts/<masejta>/<daf>.pdf`), botón **Descargar** para oír sin
  internet (usa `descargas_offline.js`; si no está cargado, simplemente no aparece), y ◀ ▶ entre dafim.
- Todo se actualiza solo: cuando el bot publica un shiur o una tablita nueva, la app la ve.

## Estilo
Clases con prefijo `oz-` en un `<style id="oz-css">` inyectado; sobreescribe lo que quieras en tu CSS.
Colores base: azul marino `#0f2a4a` y dorado `#f2c14e` (los del logo).
