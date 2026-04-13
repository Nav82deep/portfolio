/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — Loading, trippy cursor, moving stars, scroll fx
   ═══════════════════════════════════════════════════════════════ */

// ── Loading + Hero Name Transition ───────────────────────────────
// Loader: letters appear right-to-left, then fall downward + scatter
// Hero: letters drop in from top, right-to-left, as if falling from loader
(function initLoaderAndHero() {
  const loaderText = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  const heroName = document.getElementById('heroName');
  const name = 'NAVDEEP';
  const heroDisplay = 'Navdeep';
  const letterCount = name.length;

  // Phase 1: Loader letters appear RIGHT to LEFT (last letter first)
  name.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    // Reverse order: last letter appears first
    const reverseIndex = letterCount - 1 - i;
    span.style.animationDelay = `${0.2 + reverseIndex * 0.1}s`;
    span.className = 'loader-letter';
    loaderText.appendChild(span);
  });

  // Phase 2: After 1.2s, letters fall out right-to-left (last letter falls first)
  setTimeout(() => {
    const loaderLetters = loaderText.querySelectorAll('.loader-letter');
    loaderLetters.forEach((span, i) => {
      const reverseIndex = letterCount - 1 - i;
      span.style.animationDelay = `${reverseIndex * 0.08}s`;
      span.classList.add('falling');
    });
  }, 1200);

  // Phase 3: Fade loader, hero letters drop in from above (right-to-left)
  setTimeout(() => {
    loader.classList.add('done');
    document.body.style.overflow = '';

    // Hero letters drop in — right to left (last letter lands first)
    heroDisplay.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'hero-letter';
      const reverseIndex = letterCount - 1 - i;
      span.style.animationDelay = `${reverseIndex * 0.08}s`;
      heroName.appendChild(span);
    });
  }, 1800);

  document.body.style.overflow = 'hidden';
})();

// ── Trippy Cursor (mix-blend-mode difference + trail) ────────────
const cursor = document.getElementById('cursor');

let mouseX = -100, mouseY = -100;
let cursorX = -100, cursorY = -100;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Main cursor — smooth follow
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Grow on hover
const interactiveEls = document.querySelectorAll('a, button, .project-row, .cert-card, .stack-item');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));

// ── Moving Starfield + Shooting Stars ────────────────────────────
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.5 + 0.08,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1 + 0.05,
      twinkle: Math.random() * 0.02 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function spawnShootingStar() {
  // Random angle between 20-60 degrees downward
  const angle = (20 + Math.random() * 40) * (Math.PI / 180);
  const speed = 4 + Math.random() * 6;
  shootingStars.push({
    x: Math.random() * canvas.width * 0.8,
    y: Math.random() * canvas.height * 0.3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 1,
    decay: 0.012 + Math.random() * 0.008,
    length: 40 + Math.random() * 60,
    width: 1 + Math.random() * 1.5,
  });
}

// Spawn a shooting star every 2-5 seconds
setInterval(spawnShootingStar, 2000 + Math.random() * 3000);
// Start with one
setTimeout(spawnShootingStar, 500);

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() * 0.001;

  // Draw drifting stars
  for (const s of stars) {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < -2) s.x = canvas.width + 2;
    if (s.x > canvas.width + 2) s.x = -2;
    if (s.y < -2) s.y = canvas.height + 2;
    if (s.y > canvas.height + 2) s.y = -2;

    const opacity = s.o + Math.sin(t * s.twinkle * 8 + s.phase) * 0.2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.02, Math.min(0.65, opacity))})`;
    ctx.fill();
  }

  // Draw shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += ss.vx;
    ss.y += ss.vy;
    ss.life -= ss.decay;

    if (ss.life <= 0) {
      shootingStars.splice(i, 1);
      continue;
    }

    // Draw trail as a gradient line
    const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length * ss.life;
    const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length * ss.life;

    const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
    grad.addColorStop(0.6, `rgba(255, 255, 255, ${ss.life * 0.3})`);
    grad.addColorStop(1, `rgba(255, 255, 255, ${ss.life * 0.9})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(ss.x, ss.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = ss.width * ss.life;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright head
    ctx.beginPath();
    ctx.arc(ss.x, ss.y, ss.width * ss.life * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${ss.life * 0.8})`;
    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
window.addEventListener('resize', initStars);

// ── Scroll Reveal ────────────────────────────────────────────────
const revealTargets = document.querySelectorAll(
  '.section-title, .section-sub, .about-text, .about-details, .timeline-item, ' +
  '.project-row, .cert-card, .stack-category, .contact-link, .detail-row'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('fallen');
      entry.target.classList.add('visible');
    } else if (entry.target.classList.contains('visible')) {
      // Element scrolled out — "fall off" like losing magnet control
      entry.target.classList.remove('visible');
      entry.target.classList.add('fallen');
    }
  });
}, { threshold: 0.05 });

revealTargets.forEach(el => revealObserver.observe(el));

// ── Project Hover Image ──────────────────────────────────────────
const hoverImg = document.createElement('img');
hoverImg.className = 'project-hover-img';
document.body.appendChild(hoverImg);

document.querySelectorAll('.project-row[data-image]').forEach(row => {
  const src = row.getAttribute('data-image');
  if (!src) return;

  row.addEventListener('mouseenter', () => {
    hoverImg.src = src;
    hoverImg.classList.add('visible');
  });
  row.addEventListener('mouseleave', () => hoverImg.classList.remove('visible'));
  row.addEventListener('mousemove', (e) => {
    hoverImg.style.left = (e.clientX + 24) + 'px';
    hoverImg.style.top = (e.clientY - 110) + 'px';
  });
});

// ── Certificate Hover Preview ────────────────────────────────────
const certPreview = document.createElement('img');
certPreview.className = 'cert-preview';
document.body.appendChild(certPreview);

document.querySelectorAll('.cert-card[data-image]').forEach(card => {
  const src = card.getAttribute('data-image');
  if (!src) return;

  card.addEventListener('mouseenter', () => {
    certPreview.src = src;
    certPreview.classList.add('visible');
  });
  card.addEventListener('mouseleave', () => certPreview.classList.remove('visible'));
  card.addEventListener('mousemove', (e) => {
    certPreview.style.left = (e.clientX + 24) + 'px';
    certPreview.style.top = (e.clientY - 130) + 'px';
  });
});

// ── Active Nav Highlight ─────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a');
const allSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});
