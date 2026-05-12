/* ======================================
   ANISH CHAUHAN - PORTFOLIO JS
   Ultra Premium Interactions 2026
====================================== */

'use strict';

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  // Scroll to top on every page refresh/load
  window.scrollTo(0, 0);
  initPreloader();
  initParticles();
  initCursor();
  initNavbar();
  initTypedText();
  initRevealOnScroll();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initTestimonialsSlider();
  initContactForm();
  initBackToTop();
  initThemeToggle();
  initSmoothHover();
});

// ============================================================
// 1. PRELOADER
// ============================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      window.scrollTo(0, 0);
    }, 2200);
  });
}

// ============================================================
// 2. PARTICLE CANVAS BACKGROUND
// ============================================================
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: null, y: null };
  let animId;
  let isMobile = window.innerWidth <= 768;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = window.innerWidth <= 768;
  };

  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.3 + 0.15;
      this.color = Math.random() > 0.5 ? '99,102,241' : '139,92,246';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      if (this.x < -10 || this.x > canvas.width + 10) this.speedX *= -1;
      if (this.y < -10 || this.y > canvas.height + 10) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  // Fewer particles on mobile for better performance
  const particleCount = isMobile ? 25 : 50;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    if (isMobile) return; // Skip connections on mobile
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 10000) {
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================
// 3. CUSTOM CURSOR
// ============================================================
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  // Disable custom cursor on touch devices for better performance and usability
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 768) {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    
    // reset cursor for hoverables as well
    const style = document.createElement('style');
    style.innerHTML = 'body * { cursor: auto !important; }';
    document.head.appendChild(style);
    return;
  }
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function animateFollower() {
    // Increased lerp factor from 0.15 to 0.25 for snappier follow
    followerX += (mouseX - followerX) * 0.25;
    followerY += (mouseY - followerY) * 0.25;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Simple cursor - no hover effect on links/buttons
}

// ============================================================
// 4. NAVBAR
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
}

// ============================================================
// 5. TYPED TEXT ANIMATION
// ============================================================
function initTypedText() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const phrases = [
    'Web Experiences',
    'Mobile Apps',
    'Beautiful UI',
    'Flutter Apps',
    'Smart Solutions'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      target.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        delay = 2000;
      } else {
        delay = 100;
      }
    } else {
      target.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      } else {
        delay = 60;
      }
    }

    setTimeout(type, delay);
  }

  type();
}

// ============================================================
// 6. REVEAL ON SCROLL (INTERSECTION OBSERVER)
// ============================================================
function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ============================================================
// 7. SKILL BARS ANIMATION
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 300);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

// ============================================================
// 8. COUNTER ANIMATION
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = target / 50;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(interval);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ============================================================
// 9. PROJECT FILTER
// ============================================================
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card, i) => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = 'block';
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, i * 60);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Add click handler for project cards
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't redirect if clicking on a link inside the card
      if (e.target.closest('a')) return;
      
      const githubUrl = card.getAttribute('data-github');
      if (githubUrl) {
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
      }
    });

    // Make project cards appear clickable
    card.style.cursor = 'pointer';
  });
}

// ============================================================
// 10. TESTIMONIALS SLIDER
// ============================================================
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoPlay;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 2}rem))`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    startAutoPlay();
  }

  startAutoPlay();

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoPlay();
    }
  });
}

// ============================================================
// 11. CONTACT FORM VALIDATION
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const successEl = document.getElementById('formSuccess');

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  };

  const clearErrors = () => {
    ['nameError', 'emailError', 'phoneError', 'messageError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  };

  // Validates if it exactly ends with @gmail.com
  const validateEmail = (email) => /^[^\s@]+@gmail\.com$/.test(email.toLowerCase());
  
  // Validates if the phone number (after stripping spaces/dashes/+) has exactly 10 digits
  const validatePhone = (phone) => /^\d{10}$/.test(phone.replace(/[\s\-+()]/g, ''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!nameInput.value.trim()) {
      showError('nameError', 'Name is required');
      valid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      showError('emailError', 'Must be a valid @gmail.com address');
      valid = false;
    }

    if (!validatePhone(phoneInput.value)) {
      showError('phoneError', 'Enter exactly 10 digits');
      valid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError('messageError', 'Message must be at least 10 characters');
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('.btn-primary');
      const originalBtnHTML = btn.innerHTML;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Submit the form asynchronously using FormSubmit
      fetch("https://formsubmit.co/ajax/nightcorenime240@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          subject: subjectInput ? subjectInput.value : 'Portfolio Contact',
          message: messageInput.value
        })
      })
      .then(response => response.json())
      .then(data => {
        form.reset();
        successEl.classList.add('show');
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;

        setTimeout(() => successEl.classList.remove('show'), 5000);
      })
      .catch(error => {
        console.error("Error sending email:", error);
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
        showError('messageError', 'Failed to send message. Please try again.');
      });
    }
  });

  // Real-time validation feedback
  [nameInput, emailInput, phoneInput, messageInput, subjectInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.style.borderColor = input.value.trim() ? 'var(--accent)' : 'var(--border)';
    });
  });
}

// ============================================================
// 12. BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// 13. THEME TOGGLE (DARK / LIGHT)
// ============================================================
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ============================================================
// 14. SMOOTH HOVER GLOW ON CARDS
// ============================================================
function initSmoothHover() {
  const cards = document.querySelectorAll('.project-card, .skill-category-card, .stat-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 5;
      const tiltY = ((cx - x) / cx) * 5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(99,102,241,0.06), transparent 60%), var(--surface)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
    });
  });
}

// ============================================================
// 15. SECTION BACKGROUND PARALLAX
// ============================================================
window.addEventListener('scroll', () => {
  const orbs = document.querySelectorAll('.orb');
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = 0.05 + i * 0.03;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ============================================================
// 16. INTERSTELLAR BLACK HOLE
// ============================================================
(function initBlackHole() {
  const canvas = document.getElementById('blackholeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, running = false, animId;
  let isLight = false;
  let isMobile = false;
  let diskAngle = 0;

  /* resize */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    isMobile = window.innerWidth <= 768;
  }
  window.addEventListener('resize', () => { resize(); });
  resize();

  /* theme observer */
  const themeObs = new MutationObserver(() => {
    isLight = document.documentElement.getAttribute('data-theme') === 'light';
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* orbital debris - reduced for mobile */
  const NUM_DEBRIS = isMobile ? 80 : 200;
  const debris = [];

  class Debris {
    constructor(init) { this._reset(init); }

    _reset(init) {
      this.angle = Math.random() * Math.PI * 2;
      const minR = 56, maxR = Math.min(W, H) * 0.46;
      this.r = init ? minR + Math.random() * (maxR - minR) : maxR * (0.4 + Math.random() * 0.6);
      this.speed = 0.004 + 0.016 / (this.r / 60);
      if (Math.random() > 0.5) this.speed = -this.speed;
      this.size = 0.4 + Math.random() * 1.4;
      this.tiltX = 0.32 + Math.random() * 0.12;
      this.trail = [];
      this.trailLen = isMobile ? 3 : (5 + Math.floor(Math.random() * 5));
    }

    update() {
      this.angle += this.speed;
      this.r -= 0.035 + 0.08 * (1 - this.r / 220);
      if (this.r < 52) { this._reset(false); return; }
      const x = cx + Math.cos(this.angle) * this.r;
      const y = cy + Math.sin(this.angle) * this.r * this.tiltX;
      this.trail.unshift({ x, y });
      if (this.trail.length > this.trailLen) this.trail.pop();
    }

    beamingFactor() {
      const norm = Math.cos(this.angle);
      return Math.max(0.05, 1 + norm * 1.2);
    }

    draw() {
      if (this.trail.length < 2) return;
      const beam = this.beamingFactor();
      const tNorm = 1 - (this.r - 52) / (Math.min(W, H) * 0.46 - 52);
      const hue = (30 - tNorm * 25) | 0;
      const sat = (85 + tNorm * 15) | 0;
      const lig = (45 + tNorm * 30) | 0;
      const alpha = (0.25 + tNorm * 0.5) * beam;
      for (let i = 1; i < this.trail.length; i++) {
        const fade = (1 - i / this.trail.length) * alpha * 0.35;
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.strokeStyle = 'hsla(' + hue + ',' + sat + '%,' + lig + '%,' + fade + ')';
        ctx.lineWidth = this.size * (1 - i / this.trail.length);
        ctx.stroke();
      }
      const p = this.trail[0];
      ctx.fillStyle = 'hsla(' + hue + ',' + sat + '%,' + lig + '%,' + alpha + ')';
      ctx.fillRect(p.x - this.size, p.y - this.size, this.size * 2, this.size * 2);
    }
  }

  for (let i = 0; i < NUM_DEBRIS; i++) debris.push(new Debris(true));

  function drawDiskHalf(bhR) {
    const dw = bhR * 5.5, dh = bhR * 0.72;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(diskAngle);

    const diskGrad = ctx.createLinearGradient(-dw, 0, dw, 0);
    if (isLight) {
      diskGrad.addColorStop(0,    'rgba(245,158,11,0)');
      diskGrad.addColorStop(0.15, 'rgba(251,191,36,0.35)');
      diskGrad.addColorStop(0.35, 'rgba(254,240,138,0.75)');
      diskGrad.addColorStop(0.5,  'rgba(255,255,255,0.95)');
      diskGrad.addColorStop(0.65, 'rgba(254,240,138,0.75)');
      diskGrad.addColorStop(0.85, 'rgba(251,191,36,0.35)');
      diskGrad.addColorStop(1,    'rgba(245,158,11,0)');
    } else {
      diskGrad.addColorStop(0,    'rgba(255,100,20,0)');
      diskGrad.addColorStop(0.12, 'rgba(255,140,40,0.25)');
      diskGrad.addColorStop(0.3,  'rgba(255,180,80,0.5)');
      diskGrad.addColorStop(0.5,  'rgba(255,255,220,0.92)');
      diskGrad.addColorStop(0.7,  'rgba(255,200,100,0.6)');
      diskGrad.addColorStop(0.88, 'rgba(255,150,60,0.3)');
      diskGrad.addColorStop(1,    'rgba(255,100,20,0)');
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, dw, dh, 0, 0, Math.PI * 2);
    ctx.fillStyle = diskGrad;
    ctx.fill();

    // beaming overlay
    ctx.globalCompositeOperation = 'screen';
    const beamGrad = ctx.createLinearGradient(-dw, 0, dw, 0);
    if (!isLight) {
      beamGrad.addColorStop(0,    'rgba(255,200,100,0.25)');
      beamGrad.addColorStop(0.3,  'rgba(255,180,80,0.08)');
      beamGrad.addColorStop(0.7,  'rgba(255,150,60,0.08)');
      beamGrad.addColorStop(1,    'rgba(200,80,20,0.18)');
    } else {
      beamGrad.addColorStop(0,    'rgba(255,255,255,0.2)');
      beamGrad.addColorStop(0.5,  'rgba(255,255,255,0)');
      beamGrad.addColorStop(1,    'rgba(255,255,255,0)');
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, dw, dh, 0, 0, Math.PI * 2);
    ctx.fillStyle = beamGrad;
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // inner hot ring
    const innerRing = ctx.createRadialGradient(0, 0, bhR * 1.1, 0, 0, bhR * 1.6);
    if (isLight) {
      innerRing.addColorStop(0, 'rgba(255,255,255,0.5)');
      innerRing.addColorStop(1, 'rgba(254,240,138,0)');
    } else {
      innerRing.addColorStop(0, 'rgba(255,255,220,0.55)');
      innerRing.addColorStop(1, 'rgba(255,180,60,0)');
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, bhR * 1.6, dh * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = innerRing;
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    const BH_R = Math.min(W, H) * 0.068;
    const PHOTON_R = BH_R * 1.52;

    // space background
    ctx.fillStyle = isLight ? '#f8faff' : '#000';
    ctx.fillRect(0, 0, W, H);

    if (!isLight) {
      // nebula haze - simplified for mobile
      if (!isMobile) {
        const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
        nebula.addColorStop(0,    'rgba(20,5,50,0.35)');
        nebula.addColorStop(0.45, 'rgba(10,2,25,0.15)');
        nebula.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, W, H);
      }

      // star field - reduced on mobile
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      const starCount = isMobile ? 20 : 80;
      for (let i = 0; i < starCount; i++) {
        const sx = ((i * 137.508) % 1) * W;
        const sy = ((i * 97.431) % 1) * H;
        const sr = 0.3 + (i % 3) * 0.3;
        if (Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2) > BH_R * 2.5) {
          ctx.fillRect(sx, sy, sr, sr);
        }
      }
    }

    // Einstein ring halos - reduced on mobile
    const haloCount = isMobile ? 2 : 4;
    const haloRadii  = isMobile ? [BH_R * 3.8, BH_R * 2.6] : [BH_R * 3.8, BH_R * 3.2, BH_R * 2.6, BH_R * 2.1];
    const haloAlphas = isLight ? (isMobile ? [0.08, 0.14] : [0.06, 0.09, 0.12, 0.16]) : (isMobile ? [0.07, 0.13] : [0.05, 0.08, 0.11, 0.15]);
    haloRadii.forEach((r, i) => {
      const halo = ctx.createRadialGradient(cx, cy, r - 18, cx, cy, r + 18);
      const col  = isLight ? '245,158,11' : '100,80,255';
      halo.addColorStop(0,   'rgba(' + col + ',0)');
      halo.addColorStop(0.5, 'rgba(' + col + ',' + haloAlphas[i] + ')');
      halo.addColorStop(1,   'rgba(' + col + ',0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = halo;
      ctx.lineWidth = isMobile ? 16 : 28;
      ctx.stroke();
    });

    // photon ring
    {
      const pg = ctx.createRadialGradient(cx, cy, PHOTON_R - (isMobile ? 10 : 16), cx, cy, PHOTON_R + (isMobile ? 10 : 16));
      if (isLight) {
        pg.addColorStop(0,    'rgba(253,224,71,0)');
        pg.addColorStop(0.35, 'rgba(254,240,138,0.7)');
        pg.addColorStop(0.5,  'rgba(255,255,255,0.95)');
        pg.addColorStop(0.65, 'rgba(254,240,138,0.7)');
        pg.addColorStop(1,    'rgba(253,224,71,0)');
      } else {
        pg.addColorStop(0,    'rgba(255,160,40,0)');
        pg.addColorStop(0.3,  'rgba(255,200,80,0.5)');
        pg.addColorStop(0.5,  'rgba(255,255,220,0.95)');
        pg.addColorStop(0.7,  'rgba(255,200,80,0.5)');
        pg.addColorStop(1,    'rgba(255,160,40,0)');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, PHOTON_R, 0, Math.PI * 2);
      ctx.strokeStyle = pg;
      ctx.lineWidth = isMobile ? 16 : 28;
      ctx.stroke();
    }

    // accretion disk
    diskAngle += 0.003;
    drawDiskHalf(BH_R);

    // debris particles behind BH
    const behind = [], front = [];
    debris.forEach(p => {
      const y = cy + Math.sin(p.angle) * p.r * p.tiltX;
      if (y < cy) behind.push(p); else front.push(p);
    });
    behind.forEach(p => { p.update(); p.draw(); });

    // event horizon glow rim
    const rimGlow = ctx.createRadialGradient(cx, cy, BH_R * 0.85, cx, cy, BH_R * 1.35);
    if (isLight) {
      rimGlow.addColorStop(0,   'rgba(254,240,138,0)');
      rimGlow.addColorStop(0.5, 'rgba(253,224,71,0.2)');
      rimGlow.addColorStop(1,   'rgba(245,158,11,0)');
    } else {
      rimGlow.addColorStop(0,   'rgba(255,160,40,0)');
      rimGlow.addColorStop(0.45,'rgba(255,180,80,0.25)');
      rimGlow.addColorStop(1,   'rgba(255,120,40,0)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, BH_R * 1.35, 0, Math.PI * 2);
    ctx.fillStyle = rimGlow;
    ctx.fill();

    // the black void
    ctx.beginPath();
    ctx.arc(cx, cy, BH_R, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? '#f8faff' : '#000';
    ctx.fill();

    // front debris
    front.forEach(p => { p.update(); p.draw(); });

    // polar relativistic jets - simplified on mobile
    if (!isMobile) {
      const jetLen = H * 0.4;
      const jetPulse = 1 + 0.15 * Math.sin(Date.now() * 0.0025);
      const jetW = (4 + Math.sin(Date.now() * 0.003) * 2) * jetPulse;

      [
        [cx, cy - BH_R * 1.05, cx, cy - BH_R * 1.05 - jetLen],
        [cx, cy + BH_R * 1.05, cx, cy + BH_R * 1.05 + jetLen],
      ].forEach(function(pair) {
        var x1 = pair[0], y1 = pair[1], x2 = pair[2], y2 = pair[3];
        var jet = ctx.createLinearGradient(x1, y1, x2, y2);
        jet.addColorStop(0,   'rgba(160,80,255,' + (0.5 * jetPulse) + ')');
        jet.addColorStop(0.25,'rgba(120,50,255,' + (0.3 * jetPulse) + ')');
        jet.addColorStop(0.6, 'rgba(80,20,200,' + (0.12 * jetPulse) + ')');
        jet.addColorStop(1,   'rgba(60,20,200,0)');
        ctx.strokeStyle = jet;
        ctx.lineWidth = jetW;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    }

    if (running) animId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!running) { running = true; resize(); render(); }
      } else {
        running = false;
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.05 });

  var section = canvas.closest('.blackhole-section');
  if (section) observer.observe(section);
})();

// ============================================================
// BACKGROUND PARTICLES (BUBBLES) CUSTOMIZATION
// ============================================================
// These are the background bubbles that run from your cursor
//
// Settings:
// - Count: 80 particles
// - Size: 1.5-4px
// - Speed: 0.5
// - Opacity: 0.2-0.6
// - Mouse repulsion: 100px radius
// - Glow effect added for attraction
//
// To adjust:
// - More bubbles: increase 80 in the for loop
// - Bigger bubbles: change this.size range
// - Faster: increase speedX/speedY values
// - Stronger mouse effect: increase repulsion radius or force

