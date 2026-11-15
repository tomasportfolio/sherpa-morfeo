# SHERPA · Morfeo Labs

Landing del kit descargable de Sherpa, el explorador de Morfeo Labs: character sheet, vistas, referencias y videos.

**En vivo:** https://sherpa-morfeo.vercel.app

Estilo clonado de [morfeolabs.com](https://www.morfeolabs.com/): noche con estrellas, Figtree, selección azul y pastillas de vidrio.

---

## Sí, se aceptan cambios

| Tenés acceso de escritura | No tenés acceso |
|---|---|
| Push directo a `main` → Vercel publica a producción en ~1 minuto | **Fork** → rama nueva → **Pull Request** → Vercel arma un URL de *preview* para revisar → merge → producción |
| | O sin tocar código: abrí un **Issue** de tipo *Nuevo asset* con el link de Drive y alguien con acceso lo agrega |

---

## Cómo probarla en tu máquina

Todo va embebido en el repo (fuentes y thumbnails), así que alcanza con abrir `index.html` con doble click. Si preferís un servidor local:

```bash
python -m http.server 8321   # o: npx serve
```

---

## Cómo agregar un asset (imagen, video o audio)

La regla del repo: **lo pesado vive en Google Drive, al repo solo van thumbnails livianos y links.**
(GitHub rechaza archivos de más de 100 MB; videos y audios full van a Drive.)

1. **Subí el archivo a Google Drive** y compartilo como *cualquiera con el link*.
2. **Copiá el ID** del link: `https://drive.google.com/file/d/`**`ID_ACA`**`/view`
3. **Generá el thumbnail** con esta URL y guardalo en `assets/img/`:
   `https://drive.google.com/thumbnail?id=ID_ACA&sz=w1200`
   Nombralo `thumb-kebab-case.png` (o `.webp`/`.jpg` según lo que devuelva). Ideal: que pese menos de 1 MB.
4. **Agregá la tarjeta** en `index.html` con una plantilla de abajo.
5. **Commit + push** (o PR). Vercel publica solo.

### Plantilla: imagen (para la sección Referencias)

```html
<a class="ref rv lb" href="https://drive.google.com/file/d/ID_ACA/view?usp=drive_link" target="_blank" rel="noopener">
  <span class="im"><span class="esq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><img src="assets/img/thumb-tu-asset.png" alt="Descripción de la imagen" width="1200" height="800" loading="lazy"></span>
  <span class="tx"><h3>Título</h3><p>Descripción corta con actitud.</p><span class="mini">Ver archivo <svg class="ic"><use href="#i-ampliar"/></svg></span></span>
</a>
```

> El `width`/`height` son los del thumbnail real (evitan saltos de layout). Para imágenes verticales sumá `class="arriba"` al `<img>` para que el recorte priorice la carita.

### Plantilla: video vertical (marco de celular, 9/16 — sección Videos)

```html
<a class="tel rv lb" data-tipo="video" data-ar="9/16" href="https://drive.google.com/file/d/ID_ACA/view?usp=drive_link" target="_blank" rel="noopener">
  <span class="scr"><img src="assets/img/thumb-tu-video.jpg" alt="Descripción" width="720" height="1280" loading="lazy"><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8.5 5.5v13l11-6.5z" fill="currentColor"/></svg></span></span>
  <span class="cap-t">Título del video</span>
</a>
```

### Plantilla: video horizontal (16/9 — sección Videos)

```html
<a class="vid-w rv lb" data-tipo="video" href="https://drive.google.com/file/d/ID_ACA/view?usp=drive_link" target="_blank" rel="noopener">
  <span class="scr"><img src="assets/img/thumb-tu-video.jpg" alt="Descripción" width="1200" height="675" loading="lazy"><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8.5 5.5v13l11-6.5z" fill="currentColor"/></svg></span></span>
  <span class="cap-t">Título del video<small>Detalle o año</small></span>
</a>
```

> Con `data-tipo="video"` la vista previa abre el reproductor embebido de Drive. Los links deben ser archivos compartidos como *cualquiera con el link*, si no el player no carga (igual queda el botón «Abrir en Drive»).

### Audio

La landing todavía no tiene sección de audio. El patrón es el mismo (archivo en Drive + link); si querés sumarla, abrí un Issue y se agrega la sección.

---

## Antes de pushear

- Abrí `index.html` en el navegador y chequeá que tu tarjeta se vea y su vista previa funcione.
- Un asset = un commit/PR chico. Nada de re-formatear el archivo entero en el mismo push.

## Estructura

```
index.html            ← la landing (todo el contenido está acá)
assets/
├── app.css           ← estilo (tokens de morfeolabs.com + fuentes Figtree embebidas)
├── app.js            ← vista previa (lightbox), reveals, nav
├── noche.js          ← cielo estrellado (crédito: morfeolabs.com)
├── favicon.svg
└── img/              ← thumbnails: thumb-kebab-case.png/.webp/.jpg
```

---

Créditos de estilo y cielo: [morfeolabs.com](https://www.morfeolabs.com/) · Paul de Lavallaz.
