/* Sherpa · Morfeo Labs — lo propio de esta página: el nav pegado, lo que entra al llegar, el año del pie
   y la vista previa: las tarjetas abren el archivo en la web antes de ir a Google Drive.
   El cielo estrellado y los subtítulos de la casa salen de assets/noche.js (morfeolabs.com). */
(function(){
"use strict";
var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* el nav se pega cuando arranca el scroll */
var nav = document.getElementById("nav");
function pegar(){ nav.classList.toggle("pegado", scrollY > 24); }
addEventListener("scroll", pegar, {passive: true});
pegar();

/* lo que entra al llegar */
var cosas = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window && !REDUCED){
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, {rootMargin: "0px 0px -8% 0px", threshold: 0.06});
  cosas.forEach(function(el){ io.observe(el); });
} else {
  cosas.forEach(function(el){ el.classList.add("in"); });
}

/* el año del pie */
var anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

/* ───────── la vista previa ───────── */
/* Cada tarjeta sigue siendo un <a> a Drive: sin JS abre directo; con JS se ve el archivo acá mismo,
   con «Abrir en Drive» y «Descargar» debajo. Los videos van en el reproductor embebido de Drive. */
var lb = document.getElementById("lightbox");
if (lb){
  var medio = document.getElementById("lb-medio");
  var tTitulo = document.getElementById("lb-titulo");
  var tMeta = document.getElementById("lb-meta");
  var btnDrive = document.getElementById("lb-drive");
  var btnBaja = document.getElementById("lb-baja");
  var ultimo = null;

  function abrir(card){
    ultimo = card;
    var href = card.getAttribute("href") || "#";
    var id = (href.match(/\/file\/d\/([^\/]+)/) || [])[1];
    var tipo = card.dataset.tipo || "img";
    medio.innerHTML = "";
    if (tipo === "video" && id){
      /* el reproductor de Drive: el video se ve y se escucha sin salir de la página */
      var marco = document.createElement("iframe");
      marco.src = "https://drive.google.com/file/d/" + id + "/preview";
      marco.allow = "autoplay; fullscreen; encrypted-media";
      marco.allowFullscreen = true;
      var h3 = card.querySelector("h3") || card.querySelector(".cap-t");
      marco.title = "Vista previa del video" + (h3 ? ": " + h3.textContent : "");
      medio.appendChild(marco);
      /* el video vertical ocupa menos ancho: mismo alto, menos ancho */
      var ar = (card.dataset.ar || "16/9").split("/");
      lb.style.setProperty("--ar", ar[0] + "/" + ar[1]);
      lb.style.setProperty("--arn", (parseFloat(ar[0]) / parseFloat(ar[1])).toFixed(4));
    } else {
      var img = card.querySelector("img");
      var grande = document.createElement("img");
      if (img){ grande.src = img.getAttribute("src") || ""; grande.alt = img.alt || ""; grande.decoding = "async"; }
      medio.appendChild(grande);
    }
    var t = card.querySelector("h3") || card.querySelector(".cap-t");
    tTitulo.textContent = t ? t.textContent : "Vista previa";
    var m = card.querySelector(".chip") || card.querySelector("small");
    if (m){ tMeta.textContent = m.textContent; tMeta.hidden = false; } else { tMeta.hidden = true; }
    btnDrive.href = href;
    btnBaja.href = id ? "https://drive.google.com/uc?export=download&id=" + id : href;
    lb.hidden = false;
    document.documentElement.classList.add("lb-abierto");
    lb.querySelector(".lb-x").focus();
  }

  function cerrar(){
    lb.hidden = true;
    medio.innerHTML = ""; /* al vaciar el iframe deja de sonar */
    document.documentElement.classList.remove("lb-abierto");
    if (ultimo) ultimo.focus();
  }

  lb.addEventListener("click", function(e){
    if (e.target.closest("[data-lb-cerrar]")) cerrar();
  });
  addEventListener("keydown", function(e){
    if (e.key === "Escape" && !lb.hidden) cerrar();
  });

  /* el click izquierdo abre la vista previa; ctrl/click medio/shift siguen siendo links a Drive */
  document.querySelectorAll("a.lb").forEach(function(a){
    a.addEventListener("click", function(e){
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      abrir(a);
    });
  });
}
})();
