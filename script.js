/* ── URL DE GOOGLE APPS SCRIPT ── */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzN_7pHY4urRuXLO8f4GFRk5I-qQw495Ux2E4ulGcsUPRoB9a9OpWyZU_PwlKvhi6wXNg/exec';

/* ── SOBRE DE BIENVENIDA ── */
(function () {
  const overlay  = document.getElementById('intro-overlay');
  const envelope = document.getElementById('envelope');
  if (!overlay || !envelope) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('intro-locked');

  function openEnvelope() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    const delay = reduceMotion ? 200 : 1300;
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-locked');
    }, delay);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
})();

/* ── NAV: scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── MENÚ MÓVIL ── */
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
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));

/* ── FAQ TOGGLE ── */
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

/* ── SELECTOR MAPAS (GOOGLE / APPLE) ── */
function openMapSelector(googleUrl, appleUrl) {
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  if (isApple) {
    if (confirm("¿Quieres abrir la ubicación en Apple Maps? (Acepta para Apple Maps, Cancela para Google Maps)")) {
      window.open(appleUrl, '_blank');
      return;
    }
  }
  window.open(googleUrl, '_blank');
}

/* ── RSVP ── */
const asistenciaInput   = document.getElementById('r-asistencia');
const personasInput     = document.getElementById('r-personas');
const alojamientoInput  = document.getElementById('r-alojamiento');
const personasDetalle   = document.getElementById('personas-detalle');

const MENU_OPTIONS = [
  ['sin-restricciones', 'Sin restricciones'],
  ['vegetariano', 'Vegetariano'],
  ['vegano', 'Vegano'],
  ['sin-gluten', 'Sin gluten (celíaco)'],
  ['sin-lactosa', 'Sin lactosa'],
  ['sin-mariscos', 'Sin mariscos'],
  ['sin-frutos-secos', 'Sin frutos secos'],
  ['infantil', 'Menú infantil'],
  ['otro', 'Otro (indicar en notas)']
];

function menuOptionsHTML() {
  return MENU_OPTIONS.map(([v, label]) => `<option value="${v}">${label}</option>`).join('');
}

// Genera campos dinámicos para cada persona introducida
function renderPersonasDetalle() {
  const n = parseInt(personasInput.value);
  personasDetalle.innerHTML = '';
  if (isNaN(n) || n < 1) return;

  let html = '';
  for (let i = 1; i <= n; i++) {
    html += `<div class="persona-block-label">${i === 1 ? 'Tu menú' : 'Acompañante ' + (i - 1)}</div>`;
    html += '<div class="persona-block">';
    if (i > 1) {
      html += `
        <div class="rsvp-field">
          <label for="p-nombre-${i}" class="sr-only">Nombre del acompañante</label>
          <input type="text" id="p-nombre-${i}" placeholder="Nombre completo" autocomplete="off" required>
        </div>`;
    }
    html += `
        <div class="rsvp-field">
          <label for="p-menu-${i}" class="sr-only">Menú especial</label>
          <select id="p-menu-${i}" required>
            <option value="" disabled selected>Menú especial</option>
            ${menuOptionsHTML()}
          </select>
        </div>`;
    html += '</div>';
  }
  personasDetalle.innerHTML = html;
}

function toggleAsistenciaFields() {
  const valor = asistenciaInput.value;
  const asiste = valor === 'preboda' || valor === 'boda' || valor === 'ambas';

  personasInput.disabled = !asiste;
  alojamientoInput.disabled = !asiste;

  if (!asiste) {
    personasInput.value = '';
    alojamientoInput.selectedIndex = 0;
    personasDetalle.innerHTML = '';
  }
}

asistenciaInput.addEventListener('change', toggleAsistenciaFields);
personasInput.addEventListener('change', renderPersonasDetalle);

// Envío del RSVP
function submitRSVP() {
  const nombre      = document.getElementById('r-nombre').value.trim();
  const asistencia  = document.getElementById('r-asistencia').value;
  const personas    = document.getElementById('r-personas').value;
  const alojamiento = document.getElementById('r-alojamiento').value;
  const notas       = document.getElementById('r-notas').value.trim();

  if (!asistencia) {
    alert('Por favor, indícanos a qué asistirás.');
    return;
  }

  const asiste = asistencia === 'preboda' || asistencia === 'boda' || asistencia === 'ambas';

  if (!nombre) {
    alert('Por favor, indica tu nombre completo.');
    return;
  }

  if (asiste && !personas) {
    alert('Por favor, selecciona el número de personas.');
    return;
  }

  const personasData = [];
  if (asiste) {
    const n = parseInt(personas) || 0;
    for (let i = 1; i <= n; i++) {
      const nombreP = i === 1 ? nombre : (document.getElementById(`p-nombre-${i}`)?.value.trim() || '');
      const menuP   = document.getElementById(`p-menu-${i}`)?.value || '';
      personasData.push({ nombre: nombreP, menu: menuP });
    }
  }

  const submitBtn = document.querySelector('#rsvp .rsvp-submit');
  const originalText = submitBtn.innerText;
  submitBtn.disabled = true;
  submitBtn.innerText = 'ENVIANDO...';

  const payload = { nombre, asistencia, personas, alojamiento, personasData, notas };

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

/* ── CARGAR FOTOS/VÍDEOS EN LA GALERÍA ── */
function cargarGalería() {
  const gridContainer = document.getElementById('grid-fotos');
  if (!gridContainer) return;
  
  fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success' && data.fotos && data.fotos.length > 0) {
        gridContainer.innerHTML = '';
        
        data.fotos.forEach(foto => {
          const item = document.createElement('div');
          item.className = 'foto-item';
          
          if (foto.url.match(/\.(mp4|webm|ogg|mov)/i) || foto.mimeType?.includes('video')) {
            item.innerHTML = `<video src="${foto.url}" controls preload="metadata"></video>`;
          } else {
            item.innerHTML = `<img src="${foto.url}" alt="Recuerdo de la boda" loading="lazy">`;
          }
          gridContainer.appendChild(item);
        });
      } else {
        gridContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">Aún no hay fotos ni vídeos. ¡Sé el primero en compartir uno!</p>';
      }
    })
    .catch(err => {
      console.error('Error al cargar la galería:', err);
      gridContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">No se pudieron cargar las fotos en este momento.</p>';
    });
}

document.addEventListener('DOMContentLoaded', cargarGalería);

/* ── SUBIR FOTOS Y VÍDEOS ── */
function uploadFoto() {
  const nombreInput = document.getElementById('f-nombre').value.trim();
  const fileInput   = document.getElementById('f-archivo');
  const file        = fileInput.files[0];
  const btn         = document.getElementById('btn-foto');

  if (!file) {
    alert('Por favor, selecciona un archivo.');
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
      btn.innerText = 'SUBIR OTRO ARCHIVO';
      
      setTimeout(cargarGalería, 2000);
    })
    .catch(err => {
      console.error(err);
      alert('Error al subir el archivo. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.innerText = 'SUBIR FOTO O VÍDEO';
    });
  };

  reader.readAsDataURL(file);
}

/* ── CUENTA ATRÁS ── */
const boda = new Date('2027-04-24T13:00:00').getTime();

function tickCD() {
  const cdContainer = document.getElementById('countdown');
  if (!cdContainer) return;

  const diff = boda - Date.now();

  if (diff <= 0) {
    cdContainer.innerHTML =
      '<p style="text-align:center;font-family:Cormorant Garamond,serif;font-size:32px;font-style:italic;color:var(--dark);padding:20px">¡Hoy es el gran día!</p>';
    return;
  }

  const pad = n => String(n).padStart(2, '0');
  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin = document.getElementById('cd-min');
  const elSeg = document.getElementById('cd-seg');

  if (elDias) elDias.textContent  = Math.floor(diff / 86400000);
  if (elHoras) elHoras.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  if (elMin) elMin.textContent   = pad(Math.floor((diff % 3600000) / 60000));
  if (elSeg) elSeg.textContent   = pad(Math.floor((diff % 60000) / 1000));
}

tickCD();
setInterval(tickCD, 1000);
