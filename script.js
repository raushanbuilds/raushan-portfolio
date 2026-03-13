/* ============================================
   REALAGENT.AI — PREMIUM PORTFOLIO JS
   ============================================ */

(function () {
  'use strict';

  // ---- NEW FAST COLORFUL CURSOR ----
  (function() {
    const dot  = document.getElementById('c-dot');
    const ring = document.getElementById('c-ring');

    if (!dot || !ring) return;

    const COLORS = [
      [255,100,150],
      [180,60,255],
      [100,60,240],
      [0,200,220],
      [0,210,130],
      [255,180,30],
      [255,100,20],
      [50,130,255],
    ];

    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let particles = [];

    // INSTANT dot — no lerp
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';

      for (var i = 0; i < 2; i++) {
        var c = COLORS[Math.floor(Math.random() * COLORS.length)];
        particles.push({
          x: mx + (Math.random()-0.5)*6,
          y: my + (Math.random()-0.5)*6,
          r: Math.random()*5+2,
          vx:(Math.random()-0.5)*2,
          vy:(Math.random()-0.5)*2,
          life: 1,
          decay: Math.random()*0.04+0.03,
          color: c
        });
      }
    });

    // Ring follows with slight smooth lag
    function animateRing() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Canvas for particle trail
    var cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999996;width:100vw;height:100vh;';
    document.body.appendChild(cvs);
    var ctx = cvs.getContext('2d');

    function resize() {
      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Draw loop
    function draw() {
      ctx.clearRect(0,0,cvs.width,cvs.height);
      ctx.globalCompositeOperation = 'lighter';

      particles = particles.filter(function(p){return p.life>0;});

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var r = p.color[0], g = p.color[1], b = p.color[2];
        var g2 = ctx.createRadialGradient(p.x,p.y,0, p.x,p.y,p.r*p.life*2);
        g2.addColorStop(0, 'rgba('+r+','+g+','+b+','+(p.life*0.8)+')');
        g2.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r*p.life*2,0,Math.PI*2);
        ctx.fillStyle = g2;
        ctx.fill();

        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy -= 0.04;
        p.life -= p.decay;
        p.r  *= 0.97;
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }
    draw();

    // Click burst
    document.addEventListener('click', function(e) {
      for (var i=0; i<14; i++) {
        var angle = (i/14)*Math.PI*2;
        var spd   = Math.random()*4+2;
        var c = COLORS[Math.floor(Math.random()*COLORS.length)];
        particles.push({
          x:e.clientX, y:e.clientY,
          r:Math.random()*5+3,
          vx:Math.cos(angle)*spd,
          vy:Math.sin(angle)*spd,
          life:1,
          decay:0.025,
          color:c
        });
      }
      // Ripple
      var rpl = document.createElement('div');
      rpl.style.cssText='position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;width:0;height:0;border-radius:50%;border:1.5px solid rgba(124,58,237,0.7);transform:translate(-50%,-50%);pointer-events:none;z-index:999997;animation:ripple-out 0.7s ease forwards;';
      document.body.appendChild(rpl);
      setTimeout(function(){rpl.remove();},700);
    });

    // Hover effect
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){
        ring.style.width  = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = '#06b6d4';
      });
      el.addEventListener('mouseleave',function(){
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(124,58,237,0.6)';
      });
    });

  })();

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
