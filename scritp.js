
// Poner numero 
const WHATSAPP_NUMBER = "51980710018";


const wa = (msg) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);


document.querySelectorAll(".wa-link").forEach((a) => {
  a.href = wa("Hola, quiero un diagnóstico tecnológico para mi empresa.");
  a.target = "_blank";
  a.rel = "noopener";
});


document.getElementById("form-diag").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  const err = document.getElementById("form-error");
  if (!d.nombre.trim() || !d.telefono.trim() || !d.problema.trim()) { err.hidden = false; return; }
  err.hidden = true;
  const msg = "Hola, soy " + d.nombre.trim() + (d.empresa.trim() ? " de " + d.empresa.trim() : "") +
    ".\nTeléfono: " + d.telefono.trim() + "\nProblema: " + d.problema.trim();
  window.open(wa(msg), "_blank", "noopener");
});


const preguntas = [
  "¿Hacen copias de seguridad de la información importante al menos una vez por semana?",
  "¿Usan contraseñas distintas para cada cuenta de trabajo?",
  "¿Tienen verificación en dos pasos en el correo y en los sistemas clave?",
  "¿Todos los equipos tienen antivirus actualizado?",
  "¿Los equipos y programas se actualizan con regularidad?",
  "¿El Wi-Fi de la empresa tiene contraseña segura y una red aparte para visitas?",
  "¿Su personal sabe reconocer correos falsos (phishing)?",
  "¿Solo las personas necesarias acceden a archivos y sistemas sensibles?"
];
const list = document.getElementById("quiz-list");
list.innerHTML = preguntas.map((p, i) =>
  '<fieldset class="q"><legend>' + p + '</legend><div class="opts">' +
  '<label><input type="radio" name="q' + i + '" value="1"><span>Sí</span></label>' +
  '<label><input type="radio" name="q' + i + '" value="0"><span>No</span></label></div></fieldset>'
).join("");

document.getElementById("quiz").addEventListener("submit", (e) => {
  e.preventDefault();
  const error = document.getElementById("quiz-error");
  let score = 0;
  for (let i = 0; i < preguntas.length; i++) {
    const c = e.target.querySelector('input[name="q' + i + '"]:checked');
    if (!c) { error.hidden = false; return; }
    score += Number(c.value);
  }
  error.hidden = true;
  const nivel = score <= 3 ? ["alto", "Riesgo alto", "Tu empresa está muy expuesta. Conviene revisar tu seguridad cuanto antes."]
    : score <= 6 ? ["medio", "Riesgo medio", "Tienes una base, pero hay puntos importantes por reforzar."]
    : ["bajo", "Riesgo bajo", "Vas bien. Un diagnóstico puede ayudarte a cerrar los últimos detalles."];
  const r = document.getElementById("quiz-result");
  r.className = "result " + nivel[0];
  r.innerHTML = "<h3>" + nivel[1] + " (" + score + " de " + preguntas.length + ")</h3><p>" + nivel[2] + "</p>" +
    '<a class="btn" target="_blank" rel="noopener" href="' +
    wa("Hola, hice la autoevaluación de seguridad en su web y obtuve " + score + " de " + preguntas.length + " (" + nivel[1] + "). Quiero un diagnóstico.") +
    '">Solicitar diagnóstico</a>';
  r.hidden = false;
  r.focus();
  r.scrollIntoView({ behavior: "smooth", block: "center" });
});