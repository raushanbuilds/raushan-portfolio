// ============================================
// RAUSHAN DUBEY - WEB & AI SYSTEMS
// Portfolio Website JavaScript — Enhanced v2
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
// SMOKE CANVAS ANIMATION (Purple Particles)
// ============================================
(function initSmokeCanvas() {
  const canvas = document.getElementById('smokeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 60;
  const particles = [];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(H * 0.2, H),
      radius: randomBetween(40, 160),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.6, -0.2),
      opacity: randomBetween(0.03, 0.12),
      fadeSpeed: randomBetween(0.0003, 0.001),
      growing: true,
      maxRadius: randomBetween(80, 220),
      // random purple hue between #8b00ff and #cc44ff
      hue: randomBetween(270, 300),
      saturation: randomBetween(80, 100),
      lightness: randomBetween(50, 70),
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = createParticle();
    p.y = randomBetween(0, H); // spread initial positions
    particles.push(p);
  }

  function drawParticle(p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`);
    gradient.addColorStop(0.5, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness - 10}%, ${p.opacity * 0.5})`);
    gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;

    // Gently expand/shrink
    if (p.growing) {
      p.radius += 0.3;
      if (p.radius >= p.maxRadius) p.growing = false;
    } else {
      p.radius -= 0.2;
    }

    // Fade out as particle rises
    if (!p.growing) {
      p.opacity -= p.fadeSpeed;
    }

    // Reset particle when faded or out of bounds
    if (p.opacity <= 0 || p.y < -p.radius * 2) {
      const fresh = createParticle();
      Object.assign(p, fresh);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });
    requestAnimationFrame(animate);
  }

  animate();
})();

// ============================================
// TYPEWRITER EFFECT
// ============================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = ['AI Voice Agents', 'Web Systems', 'Smart Automations', 'Business Growth'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 60;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      delay = 1800;
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
// ANIMATED COUNTER (count-up on scroll)
// ============================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let triggered = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + suffix;
      }, 16);
    });
    triggered = true;
  }

  // Use IntersectionObserver for the stats block
  const statsBlock = document.querySelector('.hero-stats');
  if (!statsBlock) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  counterObserver.observe(statsBlock);
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
console.log('%c👋 Welcome to Raushan Dubey\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #8b00ff;');
console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #cc44ff;');
console.log('%cInterested in working together? Chat on WhatsApp!', 'font-size: 12px; color: #A1A1AA;');
