# Datos para la app Amud Yomi (Otzar HaTorah)

Todo se sirve desde GitHub Pages: https://rabmeireliyahu.github.io/charts/

## Shiurim del Jajam Moshé Shawat (español) - Shas
- Catálogo JSON: https://rabmeireliyahu.github.io/charts/shawat_shas.json
  Estructura: masejtot -> daf -> {titulo, mp3, duracion_seg}
  El mp3 es un link directo (Archive.org), se puede reproducir/descargar tal cual.
- Feed RSS (mismo contenido, formato podcast): https://rabmeireliyahu.github.io/shawat/feed.xml

## Tablitas (resúmenes ilustrados) de Rabbi Eli Stefansky
- Índice global: https://rabmeireliyahu.github.io/charts/shas_tablitas.json
  Estructura: {"Sanhedrin": [2,3,...], "Makos": [...], ...}  (dafim disponibles)
- Índice por masejta: https://rabmeireliyahu.github.io/charts/<masejta>/tablitas.json
- PDF de un daf: https://rabmeireliyahu.github.io/charts/<masejta>/<daf>.pdf
  <masejta> en minúsculas y con guiones: sanhedrin, makos, avodah-zarah, bava-basra...
  Ejemplo: https://rabmeireliyahu.github.io/charts/sanhedrin/23.pdf

## Amud Yomi (Sanhedrín) - compatibilidad con lo existente
- Tablitas de Sanhedrín también en la ruta vieja: /sanhedrin/<daf>.pdf (misma).

## Descargar audios para oír sin internet
- Módulo listo: https://rabmeireliyahu.github.io/charts/descargas_offline.js
- Instructivo: https://rabmeireliyahu.github.io/charts/README_DESCARGAS.md

Actualizado: 2026-08-30. Estos archivos se regeneran solos; no editar a mano.
