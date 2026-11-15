/* El elenco: los robotitos de las IA, Eco y Sherpa saludan desde su planeta.
   Copiado de morfeolabs.com (motor: noche.js de Paul de Lavallaz).
   Único cambio propio de esta página: Sherpa saluda al 400% del tamaño de los demás. */
(function(){
"use strict";
var M = window.MORFEO || {}, REDUCED = !!M.REDUCED;
var $ = function(s){ return document.querySelector(s); };
var cv = $("#universo");
if (!cv || !M.agente || !M.enPantalla || !M.brillo) return;

/* un planeta visto desde su borde: devuelve dónde apoya cada cosa sobre el arco (morfeolabs.com) */
function planeta(g, w, h, alto, rgbA, rgbB){
  var R = Math.max(w * 1.05, 520), cx = w / 2, cy = h * alto + R;
  var pg = g.createRadialGradient(cx, cy - R * 0.2, R * 0.6, cx, cy, R);
  pg.addColorStop(0, "rgb(" + rgbA + ")"); pg.addColorStop(0.965, "rgb(" + rgbB + ")"); pg.addColorStop(1, "rgba(120,170,255,.95)");
  g.fillStyle = pg; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill();
  M.brillo(g, cx, cy - R, w * 1.05, "47,124,246", 0.2);
  return function(dx){ var d = Math.max(-R * 0.98, Math.min(R * 0.98, dx)); return {x: cx + d, y: cy - Math.sqrt(R * R - d * d), ang: Math.asin(d / R)}; };
}

/* Eco y Sherpa son imágenes reales (el resto son los robotitos dibujados por noche.js) */
var img = {};
[["eco", "assets/img/eco-presenta.webp"], ["sherpa", "assets/img/sherpa-entero.webp"]].forEach(function(p){
  var i = new Image(); i.decoding = "async"; i.onload = function(){ img[p[0]] = i; }; i.src = p[1];
});
function parado(g, im, p, alto){
  if (!im) return;
  var a = im.width / im.height;
  g.save(); g.translate(p.x, p.y + 2); g.rotate(p.ang * 0.7);
  g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(0, 0, alto * a * 0.36, alto * 0.05, 0, 0, 6.283); g.fill();
  g.drawImage(im, -alto * a / 2, -alto, alto * a, alto); g.restore();
}

M.enPantalla(cv, function(ts){
  var c = M.ajustar(cv), g = c.g, w = c.w, h = c.h;
  g.clearRect(0, 0, w, h);
  var apoyo = planeta(g, w, h, 0.56, "12,22,48", "26,54,116");
  var movil = w < 760, n = M.ORDEN.length;
  var paso = movil ? Math.min(w * 0.098, 42) : 84;
  var lado = Math.min(paso * (n - 1) / 2 + (movil ? w * 0.115 : 170), w * 0.44);
  var u = Math.max(Math.min(movil ? Math.min(h * 0.24, 58) : h * 0.27, (apoyo(lado).y - 8) / 4), 16); /* la unidad: el robotito */
  lado = Math.min(lado, w / 2 - u * 4 * 0.74 / 2 - 4); /* que Sherpa (4u de alto, ~0.74 de ancho) tampoco se vaya por la derecha */
  var pies = apoyo(lado);
  u = Math.max(Math.min(movil ? Math.min(h * 0.24, 58) : h * 0.27, (pies.y - 8) / 4), 16);
  for (var i = 0; i < n; i++){
    var p = apoyo((i - (n - 1) / 2) * paso), ia = M.IA[M.ORDEN[i]];
    var sal = REDUCED ? (i % 2 ? 0.8 : 0) : Math.max(0, Math.sin(ts * 1.4 - i * 0.85));
    M.agente(g, p.x, p.y + 1, u, {rgb: ia.rgb, dx: i < n / 2 ? 1 : -1, brazo: sal * 0.92, parpadeo: ((ts * 0.6 + i * 1.7) % 4.2) < 0.14});
  }
  parado(g, img.eco, apoyo(-lado), u);       /* Eco, del tamaño de los robotitos */
  parado(g, img.sherpa, pies, u * 4);        /* Sherpa, al 400% de los demás */
}, "80px 0px");
})();
