/* ============================================
   REALAGENT.AI — PREMIUM PORTFOLIO JS
   ============================================ */

(function () {
  'use strict';

  // ---- ENHANCED COLORFUL CURSOR TRAIL ----
  var cursorDot = document.getElementById('cursor-dot');
  var cursorRing = document.getElementById('cursor-ring');
  var particles = [];
  var lastX = -100, lastY = -100;
  var mouseX = -100, mouseY = -100;
  var ringX = -100, ringY = -100;

  var CURSOR_COLORS = [
    { r:255, g:107, b:157 },
    { r:196, g:77,  b:255 },
    { r:124, g:58,  b:237 },
    { r:6,   g:182, b:212 },
    { r:16,  g:185, b:129 },
    { r:251, g:191, b:36  },
    { r:249, g:115, b:22  },
    { r:59,  g:130, b:246 },
    { r:236, g:72,  b:153 },
    { r:34,  g:238, b:211 }
  ];

  if (cursorDot && cursorRing) {
    // Create fullscreen canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'cursorCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999997;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function spawnParticles(x, y, count) {
      for (var i = 0; i < count; i++) {
        var c = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          size: 5 + Math.random() * 9,
          color: c,
          life: 1,
          decay: 0.015 + Math.random() * 0.02
        });
      }
    }

    function spawnBurst(x, y) {
      for (var i = 0; i < 20; i++) {
        var angle = (Math.PI * 2 / 20) * i;
        var speed = 3 + Math.random() * 4;
        var c = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 6,
          color: c,
          life: 1,
          decay: 0.018 + Math.random() * 0.017
        });
      }
      // Ripple div
      var ripple = document.createElement('div');
      ripple.style.cssText = 'position:fixed;border-radius:50%;border:2px solid rgba(124,58,237,0.6);pointer-events:none;z-index:9999997;width:0;height:0;transform:translate(-50%,-50%);animation:rippleBurst 0.8s ease-out forwards;';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 800);
    }

    function moveCursor(x, y) {
      mouseX = x;
      mouseY = y;
      cursorDot.style.left = x + 'px';
      cursorDot.style.top = y + 'px';

      var dx = x - lastX;
      var dy = y - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 2) {
        spawnParticles(x, y, 4);
        lastX = x;
        lastY = y;
      }
    }

    // Mouse events
    document.addEventListener('mousemove', function (e) {
      moveCursor(e.clientX, e.clientY);
    });

    // Touch events — cursor on mobile too
    document.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      moveCursor(t.clientX, t.clientY);
    }, { passive: true });

    // Click + touchstart — burst
    document.addEventListener('click', function (e) {
      spawnBurst(e.clientX, e.clientY);
    });
    document.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      moveCursor(t.clientX, t.clientY);
      spawnBurst(t.clientX, t.clientY);
    }, { passive: true });

    // Lerp ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover a/button
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) {
        cursorRing.style.width = '56px';
        cursorRing.style.height = '56px';
        cursorRing.style.borderColor = '#06b6d4';
        cursorRing.style.boxShadow = '0 0 20px rgba(6,182,212,0.5), inset 0 0 16px rgba(6,182,212,0.15)';
        cursorDot.style.transform = 'translate(-50%,-50%) scale(0.3)';
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) {
        cursorRing.style.width = '44px';
        cursorRing.style.height = '44px';
        cursorRing.style.borderColor = 'rgba(124,58,237,0.7)';
        cursorRing.style.boxShadow = '0 0 12px rgba(124,58,237,0.4), inset 0 0 12px rgba(124,58,237,0.1)';
        cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    });

    // Animation loop — additive blending
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        var radius = p.size * p.life;
        if (radius < 0.3) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (p.life * 0.9) + ')');
        grad.addColorStop(1, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',0)');

        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.life + ')';

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy -= 0.05; // slight upward drift
        p.life -= p.decay;
        p.size *= 0.97;

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

  // ---- LEAD CAPTURE FORM SUBMISSION ----
  var leadForm = document.getElementById('leadForm');
  var formSuccess = document.getElementById('formSuccess');

  if (leadForm && formSuccess) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(leadForm);

      fetch(leadForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          leadForm.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          leadForm.style.display = 'none';
          formSuccess.style.display = 'block';
        }
      }).catch(function () {
        leadForm.style.display = 'none';
        formSuccess.style.display = 'block';
      });
    });
  }

})();
