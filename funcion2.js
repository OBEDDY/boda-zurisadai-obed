// ── CUENTA REGRESIVA ──
function actualizarContador() {
  const boda  = new Date('2026-11-29T18:00:00-06:00');
  const ahora = new Date();
  const diff  = boda - ahora;

  const dias    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segs    = Math.floor((diff % (1000 * 60)) / 1000);

  if (diff <= 0) {
    document.querySelector('#cd-dias').textContent     = '00';
    document.querySelector('#cd-horas').textContent    = '00';
    document.querySelector('#cd-minutos').textContent  = '00';
    document.querySelector('#cd-segundos').textContent = '00';
    document.querySelector('.countdown-section .section-title').textContent = '¡Ya es el gran día!';
    clearInterval(intervalo);
    return;
  }

  document.querySelector('#cd-dias').textContent     = String(dias).padStart(2, '0');
  document.querySelector('#cd-horas').textContent    = String(horas).padStart(2, '0');
  document.querySelector('#cd-minutos').textContent  = String(minutos).padStart(2, '0');
  document.querySelector('#cd-segundos').textContent = String(segs).padStart(2, '0');
}

actualizarContador();
const intervalo = setInterval(actualizarContador, 1000);


// ── SCROLL REVEAL ──
document.documentElement.classList.add('reveal-ready');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ── RSVP RADIOS ──
document.querySelectorAll('.rsvp-radio').forEach(el => {
  el.addEventListener('click', function() {
    document.querySelectorAll('.rsvp-radio').forEach(r => r.classList.remove('selected'));
    this.classList.add('selected');
    this.querySelector('input').checked = true;
  });
});


// ── RSVP SUBMIT ──
document.querySelector('#rsvp-form').addEventListener('submit', function(e) {
  e.preventDefault();
  this.style.display = 'none';
  document.querySelector('#rsvp-success').style.display = 'block';
});

document.querySelector('#rsvp-success').addEventListener('click', function() {
  this.style.display = 'none';
  document.querySelector('#rsvp-form').style.display = 'grid';
  document.querySelector('#rsvp-form').reset();
  document.querySelectorAll('.rsvp-radio').forEach(r => r.classList.remove('selected'));
});

// ── RSVP — envío a Google Sheets ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfTmXs264F8MyqR9ao6dvs5pJeZjkgoSdN1H2wX4xU82_qN2F4IhyI_abuZU5WeraO/exec';
// ↑ Reemplaza con tu URL real del paso 3

document.querySelector('#rsvp-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = document.querySelector('.rsvp-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Recoger todos los datos del formulario
  const datos = {
    nombre:        document.querySelector('input[name="nombre"]').value,
    acompanantes:  document.querySelector('select[name="acompanantes"]').value,
    asistencia:    document.querySelector('input[name="asistencia"]:checked')?.value || 'No indicado',
    mensaje:       document.querySelector('textarea[name="mensaje"]').value
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {
    if (data.resultado === 'ok') {
      // ✅ Mostrar mensaje de éxito
      document.querySelector('#rsvp-form').style.display = 'none';
      document.querySelector('#rsvp-success').style.display = 'block';
    } else {
      btn.textContent = 'Confirmar asistencia';
      btn.disabled = false;
      alert('Hubo un error. Por favor intenta de nuevo.');
    }
  })
  .catch(() => {
    btn.textContent = 'Confirmar asistencia';
    btn.disabled = false;
    alert('Sin conexión. Por favor intenta de nuevo.');
  });
});