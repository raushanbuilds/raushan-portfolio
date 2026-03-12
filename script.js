/* ============================================
   REALAGENT.AI — PREMIUM PORTFOLIO JS
   ============================================ */

(function () {
  'use strict';

  // ---- COLORFUL MULTI-COLOR CURSOR TRAIL ----
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const particles = [];
  let lastX = -100, lastY = -100;
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  const colors = ['#ff6b9d','#c44dff','#7c3aed','#06b6d4','#10b981','#fbbf24','#f97316','#3b82f6'];

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  if (!isTouchDevice() && cursorDot && cursorRing) {
    // Create fullscreen canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'cursorCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move — move dot+ring, spawn trail particles
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';

      // Only spawn if moved >3px
      var dx = mouseX - lastX;
      var dy = mouseY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 3) {
        for (var i = 0; i < 3; i++) {
          particles.push({
            x: mouseX + (Math.random() - 0.5) * 4,
            y: mouseY + (Math.random() - 0.5) * 4,
            size: 4 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: 0.02 + Math.random() * 0.03,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5
          });
        }
        lastX = mouseX;
        lastY = mouseY;
      }
    });

    // Lerp ring to follow cursor smoothly
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Click — burst 16 particles + ripple
    document.addEventListener('click', function (e) {
      // Spawn 16 burst particles
      for (var i = 0; i < 16; i++) {
        var angle = (Math.PI * 2 / 16) * i;
        var speed = 2 + Math.random() * 3;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: 5 + Math.random() * 7,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: 0.02 + Math.random() * 0.02,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      }

      // Ripple div
      var ripple = document.createElement('div');
      ripple.style.cssText = 'position:fixed;border-radius:50%;border:2px solid rgba(124,58,237,0.6);pointer-events:none;z-index:9999997;transform:translate(-50%,-50%);animation:rippleBurst 0.6s ease forwards;';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });

    // Hover a/button — ring scale 1.8x cyan, dot shrink 0.4x
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1.8)';
        cursorRing.style.borderColor = '#06b6d4';
        cursorDot.style.transform = 'translate(-50%,-50%) scale(0.4)';
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(124,58,237,0.6)';
        cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    });

    // Animation loop — draw particles on canvas
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        var radius = p.size * p.life;
        if (radius < 0.5) { particles.splice(i, 1); continue; }

        // Draw radial gradient circle with glow
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.size *= 0.98;
        p.vx *= 0.96;
        p.vy *= 0.96;

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
