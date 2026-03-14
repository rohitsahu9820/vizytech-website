// ═══════════════════════════════════════
// DataViz Pro — Main JS
// ═══════════════════════════════════════

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.body.classList.toggle('nav-mobile-open');
  });
}

// ── Image Upload & Portfolio ──
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const portfolioGrid = document.getElementById('portfolioGrid');

if (uploadZone) {
  // Drag & drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
  uploadZone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      addPortfolioCard(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  });
}

function addPortfolioCard(src, name) {
  const title = name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const card = document.createElement('div');
  card.className = 'portfolio-card';
  card.innerHTML = `
    <div class="pc-inner">
      <div class="pc-img-area">
        <img src="${src}" alt="${title}" loading="lazy"/>
      </div>
      <div class="pc-info">
        <div class="pc-tag">Uploaded</div>
        <h3>${title}</h3>
        <p>Custom dashboard solution.</p>
      </div>
    </div>
  `;
  card.style.animation = 'fadeInUp 0.5s ease both';
  if (portfolioGrid) portfolioGrid.appendChild(card);
}

// ── Intersection Observer for animations ──
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.industry-card, .portfolio-card, .testimonial-card, .process-step').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// ── Smooth active nav link ──
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
});

// ── Counter animation ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat strong');
      const data = [150, 18, 98];
      const suffixes = ['+', '+', '%'];
      stats.forEach((s, i) => animateCounter(s, data[i], suffixes[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
