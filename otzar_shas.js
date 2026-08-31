/* otzar_shas.js — Otzar HaTorah · Navegador del Shas para Amud Yomi
   Muestra TODAS las masejtot del Jajam Moshé Shawat (catálogo vivo de GitHub),
   con reproductor, tablita (PDF de R' Eli Stefansky) y descarga sin internet.
   Integración (una línea, antes de </body>):
     <script src="https://rabmeireliyahu.github.io/charts/descargas_offline.js"></script>
     <script src="https://rabmeireliyahu.github.io/charts/otzar_shas.js"></script>
   Opcional: <div id="otzar-shas"></div> donde quieras incrustarlo; si no existe,
   aparece un botón flotante "📚 Shas" que abre el navegador a pantalla completa.
*/
(function () {
  const BASE = 'https://rabmeireliyahu.github.io/charts/';
  const CAT = BASE + 'shawat_shas.json', TAB = BASE + 'shas_tablitas.json';
  const EN = { 'Sanhedrín':'Sanhedrin','Makot':'Makos','Shevuot':'Shevuos','Avoda Zara':'Avodah Zarah','Horayot':'Horayos',
    'Zebajim':'Zevachim','Menajot':'Menachos','Julín':'Chulin','Bava Batra':'Bava Basra','Bava Metzia':'Bava Metzia',
    'Bava Kama':'Bava Kama','Kidushin':'Kidushin','Guitín':'Gitin','Sota':'Sotah','Nazir':'Nazir','Nedarim':'Nedarim',
    'Ketubot':'Kesuvos','Yevamot':'Yevamos','Jaguiga':'Chagiga','Moed Katan':'Moed Katan','Meguila':'Megilah','Taanit':'Taanis',
    'Suca':'Succah','Yoma':'Yoma','Shekalim':'Shekalim','Eruvin':'Eruvin','Pesajim':'Pesachim','Shabat':'Shabbos','Berajot':'Berachos',
    'Beitza':'Beitzah','Rosh Hashana':'Rosh Hashanah','Bejorot':'Bechoros','Arajin':'Erchin','Temura':'Temurah','Keritot':'Kerisus',
    'Meila':'Meilah','Nida':'Nidah' };
  const HE = { 'Sanhedrín':'סנהדרין','Makot':'מכות','Shevuot':'שבועות','Avoda Zara':'עבודה זרה','Horayot':'הוריות','Zebajim':'זבחים',
    'Menajot':'מנחות','Julín':'חולין','Bava Batra':'בבא בתרא','Bava Metzia':'בבא מציעא','Bava Kama':'בבא קמא','Kidushin':'קידושין',
    'Guitín':'גיטין','Sota':'סוטה','Nazir':'נזיר','Nedarim':'נדרים','Ketubot':'כתובות','Yevamot':'יבמות','Jaguiga':'חגיגה',
    'Moed Katan':'מועד קטן','Meguila':'מגילה','Taanit':'תענית','Suca':'סוכה','Yoma':'יומא','Shekalim':'שקלים','Eruvin':'עירובין',
    'Pesajim':'פסחים','Shabat':'שבת','Berajot':'ברכות','Beitza':'ביצה','Rosh Hashana':'ראש השנה','Bejorot':'בכורות','Arajin':'ערכין',
    'Temura':'תמורה','Keritot':'כריתות','Meila':'מעילה','Nida':'נדה' };
  const ORDEN = Object.keys(HE);
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dur = s => s ? (Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')) : '';
  const gem = n => { const u=['','א','ב','ג','ד','ה','ו','ז','ח','ט'], d=['','י','כ','ל','מ','נ','ס','ע','פ','צ'], c=['','ק','ר'];
    if (n === 15) return 'טו'; if (n === 16) return 'טז'; return (c[Math.floor(n/100)]||'') + (d[Math.floor((n%100)/10)]||'') + (u[n%10]||''); };

  const CSS = `
  .oz-fab{position:fixed;right:16px;bottom:16px;z-index:9998;background:#0f2a4a;color:#f2c14e;border:0;border-radius:30px;padding:12px 18px;font:600 16px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer}
  .oz-wrap{font:15px/1.4 system-ui,sans-serif;color:#1b2a3a;background:#fff}
  .oz-full{position:fixed;inset:0;z-index:9999;overflow:auto}
  .oz-top{position:sticky;top:0;background:#0f2a4a;color:#fff;padding:12px 14px;display:flex;gap:10px;align-items:center}
  .oz-top h2{margin:0;font-size:18px;flex:1}.oz-top button{background:transparent;border:1px solid #f2c14e;color:#f2c14e;border-radius:8px;padding:6px 10px;cursor:pointer}
  .oz-busca{width:100%;box-sizing:border-box;padding:10px;border:1px solid #cfd8e3;border-radius:10px;margin:10px 0;font-size:16px}
  .oz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;padding:0 12px 12px}
  .oz-mas{background:#f4f7fb;border:1px solid #dbe3ee;border-radius:12px;padding:12px;cursor:pointer;text-align:center}
  .oz-mas b{display:block;font-size:17px}.oz-mas small{color:#5b6b7f}.oz-mas .he{font-size:15px;color:#0f2a4a}
  .oz-dafs{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:6px;padding:0 12px 12px}
  .oz-daf{border:1px solid #dbe3ee;border-radius:10px;padding:10px 4px;text-align:center;cursor:pointer;background:#fff}
  .oz-daf.ok{background:#eef6ff}.oz-daf .g{font-size:15px;color:#0f2a4a}.oz-daf .t{font-size:11px;color:#7a8a9d}
  .oz-panel{margin:10px 12px;border:1px solid #dbe3ee;border-radius:14px;padding:14px;background:#fbfcfe}
  .oz-panel h3{margin:0 0 8px;font-size:18px}.oz-panel audio{width:100%;margin:8px 0}
  .oz-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .oz-btn,.otzar-descarga{background:#0f2a4a;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-size:14px;cursor:pointer;text-decoration:none}
  .oz-btn.sec{background:#e9eef5;color:#0f2a4a}.oz-nav{display:flex;gap:8px;padding:8px 12px}.oz-nav button{flex:1}
  .oz-msg{padding:14px;color:#5b6b7f;text-align:center}`;

  let cat = null, tab = null, root = null, estado = { mas: null, daf: null };

  async function datos() {
    if (cat) return;
    const [c, t] = await Promise.all([fetch(CAT).then(r => r.json()), fetch(TAB).then(r => r.json()).catch(() => ({}))]);
    cat = c; tab = t || {};
  }
  function tablitaDe(mas, daf) {
    const en = EN[mas] || mas;
    const lista = tab[en] || [];
    return lista.indexOf(daf) >= 0 ? (BASE + slug(en) + '/' + daf + '.pdf') : null;
  }
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in (attrs || {})) { if (k === 'on') { for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]); } else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
    for (const k of kids) if (k != null) e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
    return e;
  }

  function vistaMasejtot(filtro) {
    const grid = h('div', { class: 'oz-grid' });
    const nombres = Object.keys(cat.masejtot).sort((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
    for (const m of nombres) {
      const dafs = Object.keys(cat.masejtot[m]);
      if (filtro && !(m + ' ' + (HE[m] || '')).toLowerCase().includes(filtro)) continue;
      grid.appendChild(h('div', { class: 'oz-mas', on: { click: () => { estado.mas = m; estado.daf = null; pintar(); } } },
        h('b', null, m), h('div', { class: 'he' }, HE[m] || ''), h('small', null, dafs.length + ' dafim')));
    }
    return grid;
  }
  function vistaDafs(m) {
    const dafs = Object.keys(cat.masejtot[m]).map(Number).sort((a, b) => a - b);
    const g = h('div', { class: 'oz-dafs' });
    for (const d of dafs) {
      const tiene = !!tablitaDe(m, d);
      g.appendChild(h('div', { class: 'oz-daf' + (tiene ? ' ok' : ''), on: { click: () => { estado.daf = d; pintar(); } } },
        h('div', { class: 'g' }, gem(d)), h('div', { class: 't' }, String(d) + (tiene ? ' 📄' : ''))));
    }
    return g;
  }
  function vistaDaf(m, d) {
    const it = cat.masejtot[m][String(d)];
    const id = 'shawat|' + m + '|' + d;
    const panel = h('div', { class: 'oz-panel' },
      h('h3', null, (HE[m] || m) + ' ' + gem(d) + '  ·  ' + m + ' ' + d + (it.duracion_seg ? '  (' + dur(it.duracion_seg) + ')' : '')));
    const audio = h('audio', { controls: '', preload: 'none' });
    (window.OtzarDescargas ? OtzarDescargas.srcPara(it.mp3, id) : Promise.resolve(it.mp3)).then(src => { audio.src = src; });
    panel.appendChild(audio);
    const row = h('div', { class: 'oz-row' });
    const pdf = tablitaDe(m, d);
    if (pdf) row.appendChild(h('a', { class: 'oz-btn', href: pdf, target: '_blank', rel: 'noopener' }, '📄 Tablita del daf'));
    row.appendChild(h('a', { class: 'oz-btn sec', href: it.mp3, target: '_blank', rel: 'noopener' }, '🔗 mp3'));
    if (window.OtzarDescargas) OtzarDescargas.boton(row, it.mp3, id);
    panel.appendChild(row);
    const nav = h('div', { class: 'oz-nav' });
    const dafs = Object.keys(cat.masejtot[m]).map(Number).sort((a, b) => a - b);
    const i = dafs.indexOf(d);
    nav.appendChild(h('button', { class: 'oz-btn sec', on: { click: () => { if (i > 0) { estado.daf = dafs[i - 1]; pintar(); } } } }, '◀ ' + (i > 0 ? gem(dafs[i - 1]) : '')));
    nav.appendChild(h('button', { class: 'oz-btn sec', on: { click: () => { estado.daf = null; pintar(); } } }, 'Todos los dafim'));
    nav.appendChild(h('button', { class: 'oz-btn sec', on: { click: () => { if (i < dafs.length - 1) { estado.daf = dafs[i + 1]; pintar(); } } } }, (i < dafs.length - 1 ? gem(dafs[i + 1]) : '') + ' ▶'));
    panel.appendChild(nav);
    return panel;
  }

  function pintar() {
    root.innerHTML = '';
    const top = h('div', { class: 'oz-top' });
    if (estado.mas) top.appendChild(h('button', { on: { click: () => { if (estado.daf != null) estado.daf = null; else estado.mas = null; pintar(); } } }, '◀'));
    top.appendChild(h('h2', null, estado.mas ? (estado.mas + ' · ' + (HE[estado.mas] || '')) : 'Shas · Jajam Moshé Shawat'));
    if (root.classList.contains('oz-full')) top.appendChild(h('button', { on: { click: () => { root.remove(); root = null; } } }, '✕'));
    root.appendChild(top);
    if (!estado.mas) {
      const b = h('input', { class: 'oz-busca', placeholder: 'Buscar masejta…' });
      let grid = vistaMasejtot('');
      b.addEventListener('input', () => { const n = vistaMasejtot(b.value.trim().toLowerCase()); grid.replaceWith(n); grid = n; });
      root.appendChild(h('div', { style: 'padding:0 12px' }, b));
      root.appendChild(grid);
      root.appendChild(h('div', { class: 'oz-msg' }, cat.total + ' shiurim · ' + Object.keys(cat.masejtot).length + ' masejtot · 📄 = con tablita'));
    } else if (estado.daf == null) {
      root.appendChild(vistaDafs(estado.mas));
    } else {
      root.appendChild(vistaDaf(estado.mas, estado.daf));
    }
  }

  async function abrir(contenedor) {
    if (!document.getElementById('oz-css')) { const s = h('style', { id: 'oz-css' }, CSS); document.head.appendChild(s); }
    root = contenedor || h('div', { class: 'oz-wrap oz-full' });
    root.classList.add('oz-wrap');
    if (!contenedor) document.body.appendChild(root);
    root.innerHTML = '<div class="oz-msg">Cargando el Shas…</div>';
    try { await datos(); pintar(); } catch (e) { root.innerHTML = '<div class="oz-msg">No pude cargar el catálogo. Revisa tu conexión.</div>'; }
  }

  window.OtzarShas = { abrir, cerrar: () => { if (root) { root.remove(); root = null; } } };
  document.addEventListener('DOMContentLoaded', () => {
    const inc = document.getElementById('otzar-shas');
    if (inc) abrir(inc);
    else { const fab = h('button', { class: 'oz-fab', on: { click: () => abrir(null) } }, '📚 Shas'); document.body.appendChild(fab); }
  });
  if (document.readyState !== 'loading') document.dispatchEvent(new Event('DOMContentLoaded'));
})();
