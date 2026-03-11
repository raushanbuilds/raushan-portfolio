/* ============================================
   REALAGENT.AI — PREMIUM PORTFOLIO JS
   ============================================ */

(function () {
  'use strict';

  // ---- CUSTOM CURSOR ----
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  const particles = [];

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  if (!isTouchDevice() && dot && ring && canvas && ctx) {
    // Resize canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';

      // Push particle
      particles.push({ x: mouseX, y: mouseY, life: 1 });
    });

    // Lerp ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Click effects
    document.addEventListener('mousedown', function (e) {
      document.body.classList.add('cursor-click');
      setTimeout(function () {
        document.body.classList.remove('cursor-click');
      }, 150);

      // Ripple
      var ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = (e.clientX - 60) + 'px';
      ripple.style.top = (e.clientY - 60) + 'px';
      document.body.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });

    // Particle trail rendering
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        ctx.beginPath();
        var size = (particles.length - i) * 0.08;
        if (size > 3) size = 3;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,' + (p.life * 0.25) + ')';
        ctx.fill();
        p.life -= 0.05;
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ---- NAVBAR SCROLL ----
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- MOBILE MENU ----
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- SCROLL REVEAL (IntersectionObserver) ----
  var revealItems = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children if inside a grid
          var parent = entry.target.parentElement;
          if (parent) {
            var siblings = Array.from(parent.querySelectorAll('.reveal-item'));
            var index = siblings.indexOf(entry.target);
            if (index > 0) {
              entry.target.style.transitionDelay = (index * 80) + 'ms';
            }
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    // Fallback for old browsers
    revealItems.forEach(function (item) {
      item.classList.add('visible');
    });
  }

  // ---- SMOOTH SCROLL for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

})();
