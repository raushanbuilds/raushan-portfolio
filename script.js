/* ============================================
   REALAGENTAI — PREMIUM PORTFOLIO JS
   ============================================ */

(function () {
  'use strict';



  // ---- LIGHTNING HERO BACKGROUND ----
  // /* ANIMATION REMOVED */
  // (function(){
  //   var canvas = document.getElementById('lightning-canvas');
  //   if(!canvas) return;
  //   var ctx = canvas.getContext('2d');
  //
  //   function resize(){
  //     canvas.width  = canvas.offsetWidth;
  //     canvas.height = canvas.offsetHeight;
  //   }
  //   resize();
  //   window.addEventListener('resize', resize);
  //
  //   var BLUE_COLORS = [
  //     'rgba(0, 150, 255,',
  //     'rgba(0, 200, 255,',
  //     'rgba(50, 100, 255,',
  //     'rgba(100, 180, 255,',
  //     'rgba(0, 220, 240,',
  //   ];
  //
  //   function drawBolt(x1, y1, x2, y2, roughness, depth, color, alpha){
  //     if(depth <= 0) return;
  //     var dx  = x2 - x1, dy = y2 - y1;
  //     var len = Math.sqrt(dx*dx + dy*dy);
  //     if(len < 2) return;
  //
  //     var mx = (x1+x2)/2 + (Math.random()-0.5) * roughness * len;
  //     var my = (y1+y2)/2 + (Math.random()-0.5) * roughness * len;
  //
  //     ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my);
  //     ctx.strokeStyle = color + (alpha*0.15)+')';
  //     ctx.lineWidth = depth * 3; ctx.lineCap = 'round';
  //     ctx.filter = 'blur(8px)'; ctx.stroke(); ctx.filter = 'none';
  //
  //     ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my);
  //     ctx.strokeStyle = color + alpha + ')';
  //     ctx.lineWidth = depth * 0.8; ctx.stroke();
  //
  //     ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(x2,y2);
  //     ctx.strokeStyle = color + (alpha*0.15)+')';
  //     ctx.lineWidth = depth * 3;
  //     ctx.filter = 'blur(8px)'; ctx.stroke(); ctx.filter = 'none';
  //
  //     ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(x2,y2);
  //     ctx.strokeStyle = color + alpha + ')';
  //     ctx.lineWidth = depth * 0.8; ctx.stroke();
  //
  //     drawBolt(x1,y1,mx,my, roughness, depth-1, color, alpha*0.9);
  //     drawBolt(mx,my,x2,y2, roughness, depth-1, color, alpha*0.9);
  //
  //     if(Math.random() < 0.4 && depth > 2){
  //       var bx = mx + (Math.random()-0.5) * canvas.width  * 0.3;
  //       var by = my + Math.random() * (canvas.height - my) * 0.5;
  //       drawBolt(mx,my,bx,by, roughness*1.2, depth-2, color, alpha*0.5);
  //     }
  //   }
  //
  //   function drawBlob(){
  //     var bx = canvas.width  * 0.5;
  //     var by = canvas.height * 0.75;
  //     var r  = canvas.width  * 0.35;
  //     var g  = ctx.createRadialGradient(bx, by, 0, bx, by, r);
  //     g.addColorStop(0,   'rgba(0, 80, 200, 0.25)');
  //     g.addColorStop(0.5, 'rgba(0, 50, 150, 0.10)');
  //     g.addColorStop(1,   'rgba(0,  0,   0, 0.00)');
  //     ctx.beginPath();
  //     ctx.arc(bx, by, r, 0, Math.PI*2);
  //     ctx.fillStyle = g;
  //     ctx.fill();
  //   }
  //
  //   var bolts = [], frame = 0;
  //
  //   function spawnBolt(){
  //     var startX = canvas.width  * (0.30 + Math.random() * 0.40);
  //     var endX   = canvas.width  * (0.35 + Math.random() * 0.30);
  //     var endY   = canvas.height * (0.60 + Math.random() * 0.30);
  //     var colorIdx = Math.floor(Math.random() * BLUE_COLORS.length);
  //     bolts.push({
  //       x1: startX, y1: 0, x2: endX, y2: endY,
  //       color: BLUE_COLORS[colorIdx],
  //       life: 1,
  //       decay: 1 / (8 + Math.floor(Math.random() * 8))
  //     });
  //   }
  //
  //   function animate(){
  //     ctx.fillStyle = 'rgba(5,5,8,0.6)';
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //     drawBlob();
  //
  //     if(frame % (12 + Math.floor(Math.random()*8)) === 0){
  //       spawnBolt();
  //       if(Math.random() < 0.3) spawnBolt();
  //     }
  //
  //     bolts = bolts.filter(function(b){ return b.life > 0; });
  //     for(var i = 0; i < bolts.length; i++){
  //       var b = bolts[i];
  //       drawBolt(b.x1, b.y1, b.x2, b.y2, 0.35, 6, b.color, b.life);
  //       b.life -= b.decay;
  //     }
  //     frame++;
  //     requestAnimationFrame(animate);
  //   }
  //   animate();
  // })();

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

