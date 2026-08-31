/* descargas_offline.js — Otzar HaTorah / Amud Yomi
   Descarga audios a la memoria del dispositivo (IndexedDB) y los reproduce sin internet.
   Uso mínimo:
     const src = await OtzarDescargas.srcPara(urlMp3, idUnico);   // offline si ya está, si no la URL normal
     audio.src = src;
     OtzarDescargas.boton(contenedor, urlMp3, idUnico);            // pinta el botón "Descargar / Descargado ✓ / Quitar"
   Funciona en Chrome/Android (TWA), Safari/iOS (WKWebView) y escritorio. Archive.org permite CORS.
*/
(function (global) {
  const DB = 'otzar_audios', STORE = 'audios';
  function abrir() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  function tx(modo, fn) {
    return abrir().then(db => new Promise((res, rej) => {
      const t = db.transaction(STORE, modo);
      const st = t.store || t.objectStore(STORE);
      const out = fn(st);
      t.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      t.onerror = () => rej(t.error);
    }));
  }
  const cacheURL = {};

  const O = {
    async existe(id) { const r = await tx('readonly', st => st.getKey(id)); return r !== undefined && r !== null; },

    async guardar(url, id, onProgreso) {
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const total = +resp.headers.get('content-length') || 0;
      const reader = resp.body.getReader();
      const partes = []; let bajado = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partes.push(value); bajado += value.length;
        if (onProgreso) onProgreso(total ? bajado / total : 0, bajado);
      }
      const blob = new Blob(partes, { type: 'audio/mpeg' });
      await tx('readwrite', st => st.put({ id, url, blob, bytes: blob.size, fecha: Date.now() }));
      return blob.size;
    },

    async obtener(id) {
      if (cacheURL[id]) return cacheURL[id];
      const reg = await tx('readonly', st => st.get(id));
      if (!reg || !reg.blob) return null;
      cacheURL[id] = URL.createObjectURL(reg.blob);
      return cacheURL[id];
    },

    async srcPara(url, id) { return (await O.obtener(id)) || url; },

    async borrar(id) {
      if (cacheURL[id]) { URL.revokeObjectURL(cacheURL[id]); delete cacheURL[id]; }
      await tx('readwrite', st => st.delete(id));
    },

    async lista() {
      const regs = await tx('readonly', st => st.getAll());
      return (regs || []).map(r => ({ id: r.id, url: r.url, bytes: r.bytes, fecha: r.fecha }));
    },

    async espacio() {
      try { const e = await navigator.storage.estimate(); return { usado: e.usage, cuota: e.quota }; }
      catch (e) { return null; }
    },

    boton(contenedor, url, id, textos) {
      const T = Object.assign({ bajar: '⬇ Descargar', listo: '✓ Descargado', quitar: 'Quitar', bajando: 'Bajando' }, textos || {});
      const b = document.createElement('button');
      b.className = 'otzar-descarga';
      let estado = 'no';
      const pintar = async () => {
        estado = (await O.existe(id)) ? 'si' : 'no';
        b.textContent = estado === 'si' ? T.listo + ' · ' + T.quitar : T.bajar;
        b.disabled = false;
      };
      b.onclick = async () => {
        b.disabled = true;
        try {
          if (estado === 'si') { await O.borrar(id); }
          else {
            await O.guardar(url, id, (p, bytes) => {
              b.textContent = T.bajando + ' ' + (p ? Math.round(p * 100) + '%' : Math.round(bytes / 1048576) + ' MB');
            });
          }
        } catch (e) {
          b.textContent = 'Error: ' + (e.message || e);
          setTimeout(pintar, 2500);
          return;
        }
        pintar();
      };
      (contenedor || document.body).appendChild(b);
      pintar();
      return b;
    }
  };
  global.OtzarDescargas = O;
})(window);
