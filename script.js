// ============================================
// RAUSHAN DUBEY - WEB & AI SYSTEMS
// Portfolio Website JavaScript
// ============================================

// ============================================
// DOM ELEMENTS
// ============================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelectorAll('.nav-link');
const floatingButtons = document.getElementById('floatingButtons');
const revealElements = document.querySelectorAll('.reveal');

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add scrolled class for styling
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
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
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
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for multiple elements
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

// Observe all reveal elements
revealElements.forEach(element => {
  revealObserver.observe(element);
});

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
  yearElement.innerHTML = `&copy; ${currentYear} Raushan Dubey. All rights reserved.`;
}

// ============================================
// PREVENT EXTERNAL LINK ISSUES
// ============================================
// Add security attributes to external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  if (!link.hasAttribute('rel')) {
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// ============================================
// PERFORMANCE: DEBOUNCE SCROLL EVENTS
// ============================================
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(updateActiveLink, 20));

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
  // Trigger initial reveal for elements in viewport
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      element.classList.add('active');
    }
  });
});

// ============================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ============================================
// Trap focus in mobile menu when open
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
  
  // Close menu on Escape
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuToggle.focus();
  }
});

// ============================================
// FLOATING BUTTON ANALYTICS (Optional)
// ============================================
// Track clicks on CTA buttons for analytics
const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
const callButtons = document.querySelectorAll('a[href^="tel:"]');

whatsappButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('WhatsApp button clicked');
    // Add analytics tracking here if needed
    // e.g., gtag('event', 'click', { event_category: 'contact', event_label: 'whatsapp' });
  });
});

callButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Call button clicked');
    // Add analytics tracking here if needed
    // e.g., gtag('event', 'click', { event_category: 'contact', event_label: 'phone' });
  });
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Welcome to Raushan Dubey\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #3B82F6;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 14px; color: #8B5CF6;');
console.log('%cInterested in working together? Let\'s connect!', 'font-size: 12px; color: #A1A1AA;');
