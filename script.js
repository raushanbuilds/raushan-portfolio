// ============================================
// RAUSHAN DUBEY - AI & WEB SOLUTIONS
// Portfolio Website JavaScript — v3 Electric Blue
// ============================================

// ============================================
// DOM ELEMENTS
// ============================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelectorAll('.nav-link');
const floatingButtons = document.getElementById('floatingButtons');

// ============================================
// PLASMA ENERGY CANVAS ANIMATION
// ============================================
(function initPlasmaCanvas() {
  const canvas = document.getElementById('plasmaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse tracking for subtle parallax
  let mouseX = W / 2;
  let mouseY = H / 2;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // --- ENERGY PARTICLES (plasma flames) ---
  const ENERGY_COUNT = 35;
  const energyParticles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createEnergy() {
    return {
      x: rand(0, W),
      y: rand(H * 0.3, H * 1.1),
      radius: rand(60, 200),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.5, -0.15),
      opacity: rand(0.02, 0.08),
      fadeSpeed: rand(0.0002, 0.0006),
      growing: true,
      maxRadius: rand(120, 280),
      // Electric blue hue range: 195-210
      hue: rand(195, 210),
      saturation: rand(85, 100),
      lightness: rand(50, 65),
    };
  }

  for (let i = 0; i < ENERGY_COUNT; i++) {
    const p = createEnergy();
    p.y = rand(0, H);
    energyParticles.push(p);
  }

  function drawEnergy(p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`);
    gradient.addColorStop(0.4, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness - 10}%, ${p.opacity * 0.6})`);
    gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function updateEnergy(p) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.growing) {
      p.radius += 0.25;
      if (p.radius >= p.maxRadius) p.growing = false;
    } else {
      p.radius -= 0.15;
    }
    if (!p.growing) p.opacity -= p.fadeSpeed;
    if (p.opacity <= 0 || p.y < -p.radius * 2) {
      Object.assign(p, createEnergy());
    }
  }

  // --- FLOATING MICRO PARTICLES ---
  const MICRO_COUNT = 50;
  const microParticles = [];

  function createMicro() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      radius: rand(1, 2.5),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.25, -0.05),
      opacity: rand(0.15, 0.45),
      depth: rand(0.3, 1), // parallax depth
    };
  }

  for (let i = 0; i < MICRO_COUNT; i++) {
    microParticles.push(createMicro());
  }

  function drawMicro(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 191, 255, ${p.opacity})`;
    ctx.fill();
  }

  function updateMicro(p) {
    // Parallax offset based on mouse
    const parallaxX = (mouseX - W / 2) * 0.005 * p.depth;
    const parallaxY = (mouseY - H / 2) * 0.005 * p.depth;
    p.x += p.vx + parallaxX * 0.01;
    p.y += p.vy + parallaxY * 0.01;

    if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
  }

  // --- NETWORK LINES between nearby micro particles ---
  function drawNetworkLines() {
    const maxDist = 120;
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < microParticles.length; i++) {
      for (let j = i + 1; j < microParticles.length; j++) {
        const a = microParticles[i];
        const b = microParticles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = 0.04 * (1 - dist / maxDist);
          ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  // --- LIGHT RAYS ---
  function drawLightRays(time) {
    const centerX = W * 0.65;
    const centerY = H * 0.45;
    const rayCount = 6;
    for (let i = 0; i < rayCount; i++) {
      const angle = (Math.PI * 2 / rayCount) * i + time * 0.0001;
      const length = rand(200, 400);
      const gradient = ctx.createLinearGradient(
        centerX, centerY,
        centerX + Math.cos(angle) * length,
        centerY + Math.sin(angle) * length
      );
      gradient.addColorStop(0, 'rgba(0, 191, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle - 0.08) * length,
        centerY + Math.sin(angle - 0.08) * length
      );
      ctx.lineTo(
        centerX + Math.cos(angle + 0.08) * length,
        centerY + Math.sin(angle + 0.08) * length
      );
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // --- ANIMATION LOOP ---
  function animate(time) {
    ctx.clearRect(0, 0, W, H);

    // Light rays from orb area
    drawLightRays(time);

    // Energy plasma particles
    energyParticles.forEach(p => {
      updateEnergy(p);
      drawEnergy(p);
    });

    // Micro floating particles
    microParticles.forEach(p => {
      updateMicro(p);
      drawMicro(p);
    });

    // Network connections
    drawNetworkLines();

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

// ============================================
// TYPEWRITER EFFECT
// ============================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'AI Voice Agents',
    'Automation Systems',
    'High-Converting Websites',
    'Digital Experiences'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show/hide floating buttons
  if (currentScroll > 300) {
    floatingButtons.classList.add('visible');
  } else {
    floatingButtons.classList.remove('visible');
  }

  lastScroll = currentScroll;
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
mobileMenuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ============================================
// SMOOTH SCROLL & ACTIVE NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// ============================================
// LOADING — Trigger reveals in viewport
// ============================================
window.addEventListener('load', () => {
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      element.classList.add('active');
    }
  });
});

// ============================================
// PERFORMANCE: DEBOUNCE SCROLL EVENTS
// ============================================
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

window.addEventListener('scroll', debounce(updateActiveLink, 20));

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
  yearElement.innerHTML = `&copy; ${currentYear} Raushan Dubey. All rights reserved. Built with ❤️ & AI`;
}

// ============================================
// SECURITY: ADD REL TO EXTERNAL LINKS
// ============================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  if (!link.hasAttribute('rel')) {
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// ============================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ============================================
const focusableElements = navMenu.querySelectorAll('a, button');
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

navMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && navMenu.classList.contains('active')) {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuToggle.focus();
  }
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c⚡ Welcome to Raushan Dubey\'s AI Portfolio!', 'font-size: 20px; font-weight: bold; color: #00BFFF;');
console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #2563EB;');
console.log('%cInterested in working together? Chat on WhatsApp!', 'font-size: 12px; color: #94A3B8;');
