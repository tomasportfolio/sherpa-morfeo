/* Morfeo Labs · página personal de Paul (10-11): el motor de Astronora. El cielo, las cifras que corren, los subtítulos
   de la casa, los robotitos y las insignias salen de assets/noche.js de la landing de NORA
   (brands/La Fabrica/landing-nora-explicativa); las escenas propias de esta página están en app.js. */
(function(){
"use strict";
var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var DPR = Math.min(2, window.devicePixelRatio || 1);
var $ = function(s, c){ return (c || document).querySelector(s); };
var $$ = function(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

/* ---------------------------------------------------------------- el kit */
var mez = function(a, b, u){ return a + (b - a) * u; };
var entra = function(u){ return 1 - Math.pow(1 - u, 3); };
var rebote = function(u){ var s = 2.2; u -= 1; return u * u * ((s + 1) * u + s) + 1; };
var tramo = function(t, a, b){ return Math.max(0, Math.min(1, (t - a) / (b - a))); };
function mezRgb(a, b, u){ var x = a.split(","), y = b.split(","); return Math.round(mez(+x[0], +y[0], u)) + "," + Math.round(mez(+x[1], +y[1], u)) + "," + Math.round(mez(+x[2], +y[2], u)); }
function lienzo(w, h){ var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h || w)); return c; }
function azar(semilla){ var a = (semilla >>> 0) || 1; return function(){ a += 0x6d2b79f5; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function redondo(g, x, y, w, h, r){
  r = Math.min(r, w / 2, h / 2);
  g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}
var halos = {};
function halo(rgb){
  if (halos[rgb]) return halos[rgb];
  var l = lienzo(64), cx = l.getContext("2d"), gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.1, "rgba(" + rgb + ",1)"); gr.addColorStop(0.3, "rgba(" + rgb + ",0.35)"); gr.addColorStop(1, "rgba(" + rgb + ",0)");
  cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
  return (halos[rgb] = l);
}
function brillo(g, x, y, tam, rgb, al){
  if (al <= 0.003 || tam < 1) return;
  var A = g.globalAlpha;
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = A * Math.max(0, Math.min(1, al));
  g.drawImage(halo(rgb), x - tam / 2, y - tam / 2, tam, tam); g.restore();
}
/* un canvas que sigue el tamaño de su caja, en píxeles del dispositivo */
function ajustar(cv){
  var r = cv.getBoundingClientRect(), w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  if (cv._w !== w || cv._h !== h){ cv._w = w; cv._h = h; cv.width = w * DPR; cv.height = h * DPR; }
  var g = cv.getContext("2d"); g.setTransform(DPR, 0, 0, DPR, 0, 0); return {g: g, w: w, h: h};
}
/* corre el cuadro sólo mientras la sección está en pantalla */
function enPantalla(el, fn, margen){
  var on = false, raf = 0;
  function tick(ts){ if (!on) return; fn(ts / 1000); raf = requestAnimationFrame(tick); }
  new IntersectionObserver(function(es){ es.forEach(function(e){
    if (e.isIntersecting && !on){ on = true; raf = requestAnimationFrame(tick); }
    else if (!e.isIntersecting && on){ on = false; cancelAnimationFrame(raf); }
  }); }, {rootMargin: margen || "80px 0px"}).observe(el);
}

/* ---------------------------------------------------------------- las IA, con sus logos reales */
var IA = {
  claude:     {rgb: "236,132,92",  logo: "claude-color.svg",    nombre: "Claude"},
  chatgpt:    {rgb: "86,224,170",  logo: "openai.svg",          nombre: "ChatGPT",    oscuro: true},
  gemini:     {rgb: "96,150,255",  logo: "gemini-color.svg",    nombre: "Gemini"},
  seedance:   {rgb: "70,200,220",  logo: "bytedance-color.svg", nombre: "Seedance"},
  kling:      {rgb: "186,140,255", logo: "kling-color.svg",     nombre: "Kling"},
  elevenlabs: {rgb: "214,220,232", logo: "elevenlabs.svg",      nombre: "ElevenLabs", oscuro: true}
};
var ORDEN = ["claude", "chatgpt", "gemini", "seedance", "kling", "elevenlabs"];
var ROJO = "255,70,60", ORO = "255,206,96", VERDE = "120,240,110", AZUL = "47,124,246";
/* la gracias usa sólo el cielo: los logos se cargan donde hay robots */
if ($("[data-robots]")) ORDEN.forEach(function(k){
  var img = new Image(); img.decoding = "async";
  img.onload = function(){
    var L = lienzo(96), c = L.getContext("2d"); c.drawImage(img, 0, 0, 96, 96);
    /* los logos de un color (OpenAI, ElevenLabs) van en blanco sobre su ficha oscura, como en el kit */
    if (IA[k].oscuro){ c.globalCompositeOperation = "source-in"; c.fillStyle = "#ffffff"; c.fillRect(0, 0, 96, 96); }
    IA[k].img = L;
  };
  img.src = "/assets/logos/" + IA[k].logo;
});

/* la ficha de vidrio con el logo, centrada en (x, y) */
function insignia(g, x, y, tam, ia, al){
  if (al <= 0.01 || tam < 4) return;
  var c = IA[ia], L = c.img;
  g.save(); g.globalAlpha *= al;
  brillo(g, x, y, tam * 2.6, c.rgb, 0.45);
  redondo(g, x - tam / 2, y - tam / 2, tam, tam, tam * 0.26);
  var bg = g.createLinearGradient(x, y - tam / 2, x, y + tam / 2);
  if (c.oscuro){ bg.addColorStop(0, "rgb(" + mezRgb(c.rgb, "40,30,60", 0.55) + ")"); bg.addColorStop(1, "rgb(" + mezRgb(c.rgb, "10,8,20", 0.8) + ")"); }
  else { bg.addColorStop(0, "rgb(255,253,248)"); bg.addColorStop(1, "rgb(232,228,220)"); }
  g.fillStyle = bg; g.fill();
  g.strokeStyle = "rgba(" + c.rgb + ",0.95)"; g.lineWidth = Math.max(1.2, tam * 0.045); g.stroke();
  if (L){ var lt = tam * 0.58; g.drawImage(L, x - lt / 2, y - lt / 2, lt, lt); }
  g.restore();
}

/* el robotito de los reels: cuerpo de cápsula, cabeza redonda con visor y dos ojos de luz. (x, y) = sus pies, s = alto.
   o: { rgb, al, brazo (0-1, levanta el de adelante), dx (-1/1, hacia dónde mira), halo (0-1), manoLuz (0-1) } */
function agente(g, x, y, s, o){
  o = o || {};
  var al = o.al == null ? 1 : o.al; if (al <= 0.01 || s < 3) return null;
  var rgb = o.rgb || "236,132,92", dx = o.dx == null ? 1 : o.dx;
  g.save(); g.globalAlpha *= al; g.lineCap = "round";
  g.fillStyle = "rgba(0,0,0,0.38)"; g.beginPath(); g.ellipse(x, y, s * 0.34, s * 0.09, 0, 0, 6.283); g.fill();
  if (o.halo > 0.01) brillo(g, x, y - s * 0.55, s * 1.3, "255,240,200", 0.3 * o.halo);
  var bw = s * 0.46, bh = s * 0.5, by = y - s * 0.12 - bh;
  g.strokeStyle = "rgb(" + mezRgb(rgb, "20,18,26", 0.55) + ")"; g.lineWidth = s * 0.1;
  g.beginPath(); g.moveTo(x - s * 0.1, by + bh); g.lineTo(x - s * 0.11, y - s * 0.02); g.moveTo(x + s * 0.1, by + bh); g.lineTo(x + s * 0.11, y - s * 0.02); g.stroke();
  var hombro = by + bh * 0.22;
  function brazo(lado, sube){
    var hx = x + lado * bw * 0.5, ang = mez(0.15, -2.6, sube);
    var ex = hx + lado * Math.sin(-ang) * s * 0.34, ey = hombro + Math.cos(ang) * s * 0.34;
    g.strokeStyle = "rgb(" + mezRgb(rgb, "30,26,40", 0.35) + ")"; g.lineWidth = s * 0.11;
    g.beginPath(); g.moveTo(hx, hombro); g.lineTo(ex, ey); g.stroke();
    g.fillStyle = "rgb(" + mezRgb(rgb, "255,255,255", 0.3) + ")"; g.beginPath(); g.arc(ex, ey, s * 0.075, 0, 6.283); g.fill();
    return [ex, ey];
  }
  brazo(-dx, 0);
  redondo(g, x - bw / 2, by, bw, bh, bw * 0.42);
  var cg = g.createLinearGradient(x - bw / 2, by, x + bw / 2, by + bh);
  cg.addColorStop(0, "rgb(" + mezRgb(rgb, "255,255,255", 0.35) + ")"); cg.addColorStop(0.55, "rgb(" + rgb + ")"); cg.addColorStop(1, "rgb(" + mezRgb(rgb, "15,10,25", 0.55) + ")");
  g.fillStyle = cg; g.fill();
  brillo(g, x, by + bh * 0.42, s * 0.42, "255,255,255", 0.5);
  var hr = s * 0.25, hy = by - hr * 0.82;
  var hg = g.createRadialGradient(x - hr * 0.4, hy - hr * 0.45, hr * 0.1, x, hy, hr * 1.05);
  hg.addColorStop(0, "rgb(252,250,246)"); hg.addColorStop(0.6, "rgb(" + mezRgb("236,234,230", rgb, 0.18) + ")"); hg.addColorStop(1, "rgb(" + mezRgb(rgb, "20,16,30", 0.5) + ")");
  g.fillStyle = hg; g.beginPath(); g.arc(x, hy, hr, 0, 6.283); g.fill();
  var vx = x + dx * hr * 0.12;
  redondo(g, vx - hr * 0.68, hy - hr * 0.34, hr * 1.36, hr * 0.68, hr * 0.32); g.fillStyle = "rgba(14,14,26,0.95)"; g.fill();
  [-0.3, 0.3].forEach(function(lx){
    var parpadeo = o.parpadeo ? 0.15 : 1;
    g.fillStyle = "rgba(" + mezRgb(rgb, "255,255,255", 0.45) + ",1)"; g.beginPath(); g.ellipse(vx + lx * hr, hy, hr * 0.12, hr * 0.17 * parpadeo, 0, 0, 6.283); g.fill();
    brillo(g, vx + lx * hr, hy, hr * 0.9, rgb, 0.6);
  });
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(x - hr * 0.42, hy - hr * 0.55, hr * 0.2, hr * 0.1, -0.6, 0, 6.283); g.fill();
  var mano = brazo(dx, o.brazo || 0);
  if (o.manoLuz > 0.01) brillo(g, mano[0], mano[1], s * 0.8, rgb, o.manoLuz);
  g.restore();
  return {cabeza: [x, hy, hr], mano: mano};
}

/* ---------------------------------------------------------------- el cielo: noche, nebulosa, polvo y estrellas que pasan */
/* El fondo (nebulosa y polvo) se pinta una vez y sube despacio con el scroll. Encima van estrellas sueltas a distintas
   profundidades: las de cerca suben más rápido y, cuando el scroll corre, dejan estela, como las del kit cuando la cámara
   se mueve (cielo.js, estrellas). De vez en cuando cruza una fugaz. Quieto no dibuja nada: no gasta batería. */
(function(){
  var cv = $("#cielo"); if (!cv) return;
  var capa = null, cw = 0, ch = 0, sueltas = [], fugaz = null, y0 = scrollY, vel = 0, corre = false, ultima = performance.now() - 6500; /* la primera cruza a los pocos segundos de entrar */
  var COLS = ["255,178,107", "243,246,255", "169,200,255", "243,246,255", "255,231,163"];
  function armar(){
    cw = innerWidth; ch = innerHeight;
    cv.width = cw * DPR; cv.height = ch * DPR;
    var H = ch * 2, W = cw;
    capa = lienzo(W * DPR, H * DPR);
    var g = capa.getContext("2d"); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.fillStyle = "#03050a"; g.fillRect(0, 0, W, H);
    /* la nebulosa: violeta y azul petróleo, como el fondo del kit */
    [[0.18, 0.12, 0.65, "44,26,76", 0.55], [0.86, 0.42, 0.6, "13,44,64", 0.7], [0.3, 0.78, 0.55, "13,44,64", 0.55], [0.74, 0.95, 0.5, "44,26,76", 0.45]].forEach(function(n){
      /* cada mancha se dibuja también una vuelta arriba y otra abajo: la capa se repite al bajar y no deja costura */
      [-H, 0, H].forEach(function(dy){
        var x = n[0] * W, y = n[1] * H + dy, r = n[2] * Math.max(W, ch), gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, "rgba(" + n[3] + "," + n[4] + ")"); gr.addColorStop(1, "rgba(" + n[3] + ",0)");
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      });
    });
    var az = azar(77), n = Math.round(W * H / 1400);
    for (var i = 0; i < n; i++){
      var x = az() * W, y = az() * H, b = 0.2 + az() * 0.55, c = az() < 0.14 ? "255,205,175" : az() < 0.26 ? "185,205,255" : "236,239,255";
      g.fillStyle = "rgba(" + c + "," + b + ")"; var t = az() < 0.06 ? 1.8 : 1.1; g.fillRect(x, y, t, t);
    }
    for (var j = 0; j < Math.round(W * H / 40000); j++){
      var sx = az() * W, sy = az() * H, tam = 6 + Math.pow(az(), 3) * 18;
      brillo(g, sx, sy, tam, COLS[j % COLS.length], 0.5 + az() * 0.4);
    }
    /* las sueltas: z es la cercanía (0,25 lejos, 1 cerca) */
    var az2 = azar(913), m = Math.round(cw * ch / 8500);
    sueltas = [];
    for (var k = 0; k < m; k++){ var z = 0.25 + az2() * 0.75; sueltas.push({x: az2() * cw, y: az2() * ch * 1.6, z: z, tam: 5 + z * 13 * (0.6 + az2() * 0.6), c: COLS[k % COLS.length], b: 0.4 + az2() * 0.5}); }
    pintar(performance.now());
  }
  function lanzarFugaz(ts){
    var x = cw * (0.4 + Math.random() * 0.55), y = ch * (0.04 + Math.random() * 0.32), largo = Math.min(cw * 0.9, 260 + Math.random() * 260);
    fugaz = {x: x, y: y, t0: ts, dur: 1000, dx: -largo, dy: largo * (0.32 + Math.random() * 0.2)}; ultima = ts;
  }
  function pintar(ts){
    if (!capa) return;
    var g = cv.getContext("2d"), H = ch * 2, off = (scrollY * 0.12) % H;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(capa, 0, -off * DPR);
    if (off > H - ch) g.drawImage(capa, 0, (H - off) * DPR);
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    var L = ch * 1.6;
    g.save(); g.lineCap = "round";
    for (var i = 0; i < sueltas.length; i++){
      var s = sueltas[i], f = 0.18 + s.z * 0.42, y = ((s.y - scrollY * f) % L + L) % L - ch * 0.3;
      if (y < -60 || y > ch + 60) continue;
      var est = REDUCED ? 0 : Math.min(120, Math.abs(vel) * f * 2.4);
      if (est > 2){
        /* al bajar la página el cielo sube: la estela queda abajo de cada estrella */
        var dir = vel > 0 ? 1 : -1, gr = g.createLinearGradient(s.x, y, s.x, y + dir * est);
        gr.addColorStop(0, "rgba(" + s.c + "," + (0.75 * s.b) + ")"); gr.addColorStop(1, "rgba(" + s.c + ",0)");
        g.globalCompositeOperation = "lighter"; g.strokeStyle = gr; g.lineWidth = Math.max(1, s.tam * 0.13);
        g.beginPath(); g.moveTo(s.x, y); g.lineTo(s.x, y + dir * est); g.stroke();
      }
      brillo(g, s.x, y, s.tam, s.c, s.b);
    }
    if (fugaz){
      var u = (ts - fugaz.t0) / fugaz.dur;
      if (u >= 1 || u < 0){ fugaz = null; }
      else {
        var e = entra(u), hx = fugaz.x + fugaz.dx * e, hy = fugaz.y + fugaz.dy * e, cola = 0.3, al = Math.sin(u * Math.PI);
        var tx = hx - fugaz.dx * cola * (0.4 + e * 0.6), ty = hy - fugaz.dy * cola * (0.4 + e * 0.6);
        var fg = g.createLinearGradient(hx, hy, tx, ty);
        fg.addColorStop(0, "rgba(243,246,255," + (0.95 * al) + ")"); fg.addColorStop(1, "rgba(169,200,255,0)");
        g.globalCompositeOperation = "lighter"; g.strokeStyle = fg; g.lineWidth = 2;
        g.beginPath(); g.moveTo(hx, hy); g.lineTo(tx, ty); g.stroke();
        brillo(g, hx, hy, 26, "243,246,255", 0.9 * al);
      }
    }
    g.restore();
  }
  var raf = 0;
  function bucle(ts){
    var dy = scrollY - y0; y0 = scrollY;
    vel = vel * 0.55 + dy * 0.45;
    pintar(ts);
    if (Math.abs(vel) > 0.2 || fugaz) raf = requestAnimationFrame(bucle);
    else { corre = false; vel = 0; pintar(ts); }
  }
  function despertar(){ if (!corre){ corre = true; y0 = scrollY; raf = requestAnimationFrame(bucle); } }
  addEventListener("scroll", despertar, {passive: true});
  if (!REDUCED) setInterval(function(){
    var t = performance.now();
    if (!fugaz && document.visibilityState === "visible" && t - ultima > 7000 + Math.random() * 5000){ lanzarFugaz(t); despertar(); }
  }, 1500);
  var t0 = 0;
  addEventListener("resize", function(){ clearTimeout(t0); t0 = setTimeout(function(){ if (Math.abs(innerWidth - cw) > 2 || innerHeight > ch + 80) armar(); else pintar(performance.now()); }, 120); });
  armar();
})();

/* ---------------------------------------------------------------- las cifras que corren */
/* Como los contadores de los reels: «+1.000 videos» sube desde 900, para que nunca se lea un número chico. «0 herramientas que aprender» queda fijo en 0 (Paul, 07-11:
   «tiene sentido decir 0 herramientas que aprender en vez de 8»). */
(function(){
  var bs = $$("[data-cuenta]"); if (!bs.length) return;
  var miles = function(v){ return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ io.unobserve(e.target); correr(e.target); } }); }, {threshold: 0.5, rootMargin: "0px 0px -12% 0px"});
  bs.forEach(function(b){
    var r = b.dataset.cuenta.split(">"); b._d = +r[0]; b._h = +r[1];
    b._pre = b.dataset.pre || "";
    if (!REDUCED){ b.textContent = b._pre + miles(b._d); if (b._h < b._d) b.closest(".pas").classList.add("roja"); }
    io.observe(b);
  });
  function correr(b){
    if (REDUCED) return;
    /* de a un número por vez, como un contador que corre: cada paso se ve */
    var t0 = null, pasos = Math.abs(b._h - b._d), dur = Math.min(pasos, 10) * 190, p = b.closest(".pas");
    setTimeout(function(){
      requestAnimationFrame(function paso(ts){
        if (t0 === null) t0 = ts;
        var u = Math.min(1, (ts - t0) / dur), v = Math.round(mez(b._d, b._h, pasos > 10 ? entra(u) : u)), txt = b._pre + miles(v);
        if (b.textContent !== txt) b.textContent = txt;
        if (u < 1) requestAnimationFrame(paso); else { p.classList.remove("roja"); p.classList.add("pop"); }
      });
    }, 800);
  }
})();

/* ---------------------------------------------------------------- los subtítulos de la casa */
/* Cada palabra aparece al «decirse» con un desenfoque que se aclara; la que suena va en blanco y las ya dichas en gris
   (las de .g quedan grises al final); la palabra clave (<mark>) entra en su recuadro azul con los dos tiradores. */
function partir(el){
  if (el._ws) return el._ws;
  var ws = [];
  (function rec(nodo, gris, clave){
    Array.prototype.slice.call(nodo.childNodes).forEach(function(n){
      if (n.nodeType === 3){
        var partes = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        partes.forEach(function(p){
          if (!p) return;
          if (/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(" ")); return; }
          var s = document.createElement("span"); s.className = "w"; s.textContent = p;
          if (gris) s.classList.add("gw");
          ws.push(s); frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1){
        if (n.tagName === "MARK"){ n.classList.add("w", "k"); ws.push(n); return; }
        rec(n, gris || n.classList.contains("g"), clave);
      }
    });
  })(el, false, false);
  return (el._ws = ws);
}
function decir(el, paso, alTerminar){
  var ws = partir(el);
  el.classList.add("cap-on");
  ws.forEach(function(w){ w.classList.remove("on", "dicha", "sel"); });
  if (REDUCED){ ws.forEach(function(w){ w.classList.add("on"); if (w.classList.contains("gw")) w.classList.add("dicha"); if (w.classList.contains("k")) w.classList.add("sel"); }); if (alTerminar) alTerminar(); return; }
  paso = paso || 110;
  clearTimeout(el._t); var i = 0;
  (function sig(){
    if (i > 0 && ws[i - 1].classList.contains("gw")) ws[i - 1].classList.add("dicha");
    if (i >= ws.length){ if (alTerminar) alTerminar(); return; }
    var w = ws[i]; w.classList.add("on");
    if (w.classList.contains("k")) setTimeout(function(){ w.classList.add("sel"); }, 70);
    i++; el._t = setTimeout(sig, paso * (/[.,:]$/.test(w.textContent) ? 1.9 : 1));
  })();
}
window.MORFEO_DECIR = decir;
(function(){
  var caps = $$(".cap");
  caps.forEach(function(c){ partir(c); });
  var vis = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (e.isIntersecting){ vis.unobserve(e.target); decir(e.target, +e.target.dataset.paso || 0); }
  }); }, {rootMargin: "0px 0px -6% 0px", threshold: 0.1});
  caps.forEach(function(c){ if (!c.hasAttribute("data-manual")) vis.observe(c); });
})();
/* lo que usan las escenas de app.js */
window.MORFEO = {REDUCED: REDUCED, DPR: DPR, mez: mez, entra: entra, rebote: rebote, tramo: tramo, mezRgb: mezRgb, azar: azar, redondo: redondo,
  brillo: brillo, ajustar: ajustar, enPantalla: enPantalla, IA: IA, ORDEN: ORDEN, insignia: insignia, agente: agente, decir: decir};
})();
