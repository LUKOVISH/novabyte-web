const WHATSAPP_NUMBER = "51980710018";

const wa = (msg) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);

document.querySelectorAll(".wa-link").forEach((a) => {
  a.href = wa("Hola, quiero un diagnóstico tecnológico para mi empresa.");
  a.target = "_blank";
  a.rel = "noopener";
});

// Formulario de correo -> se envía automáticamente a contacto.ialtech@gmail.com
const formMail = document.getElementById("form-mail");
if (formMail) {
  formMail.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const btn = formMail.querySelector("button");
    status.hidden = false; status.className = "status"; status.textContent = "Enviando...";
    btn.disabled = true;
    try {
      const r = await fetch("https://formsubmit.co/ajax/contacto.ialtech@gmail.com", {
        method: "POST", headers: { Accept: "application/json" }, body: new FormData(formMail)
      });
      const d = await r.json();
      if (r.ok && (d.success === true || d.success === "true")) {
        status.textContent = "Mensaje enviado. Te responderemos pronto.";
        formMail.reset();
      } else { throw new Error(d.message || "error"); }
    } catch (err) {
      status.className = "status error";
      status.textContent = "No se pudo enviar. Escríbenos por WhatsApp o a contacto.ialtech@gmail.com";
    }
    btn.disabled = false;
  });
}

// Autoevaluación de seguridad
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