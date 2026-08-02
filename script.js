/* ── URL DE GOOGLE APPS SCRIPT ── */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYC6zYnxdcdsk1i57Uv1vbR9Y6zIARucmJRULTvlsTBA7JtgVxRb2kF1MZ-ecBbbHyVw/exec';

/* ── NAV: añade clase 'scrolled' al hacer scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE MENU ── */
function openMobileMenu() {
  document.getElementById('mobile-menu').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').style.display = 'none';
  document.body.style.overflow = '';
}

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── FAQ ── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('active'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

/* ── RSVP ── */
const asistenciaInput = document.getElementById('r-asistencia');
const personasInput   = document.getElementById('r-personas');
const menuInput       = document.getElementById('r-menu');

asistenciaInput.addEventListener('change', function () {
  const valor = this.value;
  if (valor === 'no') {
    personasInput.disabled = true;
    menuInput.disabled = true;
    personasInput.value = '';
    menuInput.selectedIndex = 0;
  } else {
    personasInput.disabled = false;
    menuInput.disabled = false;
  }
});

personasInput.addEventListener('input', function () {
  const valor = parseInt(this.value);
  if (isNaN(valor)) return;
  if (valor < 1) this.value = 1;
  if (valor > 2) this.value = 2;
});

// Envío del formulario RSVP a Google Sheets
function submitRSVP() {
  const nombre     = document.getElementById('r-nombre').value.trim();
  const email      = document.getElementById('r-email').value.trim();
  const asistencia = document.getElementById('r-asistencia').value;
  const personas   = document.getElementById('r-personas').value;
  const menu       = document.getElementById('r-menu').value.trim();
  const notas      = document.getElementById('r-notas').value.trim();

  // Validación estricta: sólo permite 'si' o 'no'
  if (asistencia !== 'si' && asistencia !== 'no') {
    alert('Por favor, selecciona si asistirás o no.');
    return;
  }

  if (asistencia === 'no') {
    if (!nombre || !email) {
      alert('Por favor, rellena nombre y email.');
      return;
    }
  } else {
    if (!nombre || !email || !personas || !menu) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }
  }

  const submitBtn = document.querySelector('.rsvp-submit');
  const originalText = submitBtn.innerText;
  submitBtn.disabled = true;
  submitBtn.innerText = 'ENVIANDO...';

  const payload = { nombre, email, asistencia, personas, menu, notas };

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';
  })
  .catch(error => {
    console.error('Error al enviar:', error);
    alert('Hubo un problema al enviar la confirmación.');
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
  });
}
/* ── SUBIR FOTOS A GOOGLE DRIVE ── */
function uploadFoto() {
  const nombreInput = document.getElementById('f-nombre').value.trim();
  const fileInput   = document.getElementById('f-archivo');
  const file        = fileInput.files[0];
  const btn         = document.getElementById('btn-foto');

  if (!file) {
    alert('Por favor, selecciona una foto.');
    return;
  }

  btn.disabled = true;
  btn.innerText = 'SUBIENDO...';

  const reader = new FileReader();
  reader.onload = function (e) {
    const rawData = e.target.result.split(',')[1];
    
    const payload = {
      tipo: 'foto',
      archivo: {
        data: rawData,
        mimeType: file.type,
        nombre: `${nombreInput}_${Date.now()}_${file.name}`
      }
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      document.getElementById('foto-form').reset();
      document.getElementById('foto-success').style.display = 'block';
      btn.disabled = false;
      btn.innerText = 'SUBIR OTRA FOTO';
    })
    .catch(err => {
      console.error(err);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.innerText = 'SUBIR FOTO';
    });
  };

  reader.readAsDataURL(file);
}

/* ── CUENTA ATRÁS ── */
const boda = new Date('2027-04-24T13:00:00').getTime();

function tickCD() {
  const diff = boda - Date.now();

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<p style="text-align:center;font-family:Cormorant Garamond,serif;font-size:40px;font-style:italic;color:var(--dark);padding:80px">¡Hoy es el gran día!</p>';
    return;
  }

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-dias').textContent  = Math.floor(diff / 86400000);
  document.getElementById('cd-horas').textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById('cd-min').textContent   = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById('cd-seg').textContent   = pad(Math.floor((diff % 60000) / 1000));
}

tickCD();
setInterval(tickCD, 1000);
