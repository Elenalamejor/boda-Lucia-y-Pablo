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

// Deshabilitar campos si el usuario no asiste
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

// Limitar número de personas entre 1 y 2
personasInput.addEventListener('input', function () {
  const valor = parseInt(this.value);
  if (isNaN(valor)) return;
  if (valor < 1) this.value = 1;
  if (valor > 2) this.value = 2;
});

// Envío del formulario RSVP
function submitRSVP() {
  const nombre    = document.getElementById('r-nombre').value.trim();
  const email     = document.getElementById('r-email').value.trim();
  const asistencia = document.getElementById('r-asistencia').value;
  const personas  = document.getElementById('r-personas').value;
  const menu      = document.getElementById('r-menu').value.trim();
  const notas     = document.getElementById('r-notas').value.trim();

  if (asistencia === 'no') {
    if (!nombre || !email || !asistencia) {
      alert('Por favor, rellena nombre, email y asistencia.');
      return;
    }
  } else {
    if (!nombre || !email || !asistencia || !personas || !menu) {
      alert('Por favor, rellena todos los campos.');
      return;
    }
  }

  // Aquí puedes conectar con un backend, Formspree, Netlify Forms, etc.
  console.log({ nombre, email, asistencia, personas, menu, notas });

  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('rsvp-success').style.display = 'block';
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
