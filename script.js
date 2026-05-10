/* ======================================
   ANISH CHAUHAN - PORTFOLIO JS
   Ultra Premium Interactions 2026
====================================== */

'use strict';

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
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

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '99,102,241' : '139,92,246';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
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

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`;
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
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverables = document.querySelectorAll('a, button, .project-card, .skill-tag, .tag');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
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
// 16. BLACK HOLE ANIMATION
// ============================================================
(function initBlackHole() {
  const canvas = document.getElementById('blackholeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, animId, running = false;

  /* ---- resize ---- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
  }

  window.addEventListener('resize', () => { resize(); });
  resize();

  /* ---- orbital particles ---- */
  const NUM_PARTICLES = 280;
  const particles = [];

  class BHParticle {
    constructor() { this.reset(true); }

    reset(init) {
      const minR = 80;
      const maxR = Math.min(W, H) * 0.48;
      this.r      = init
        ? minR + Math.random() * (maxR - minR)
        : maxR * (0.35 + Math.random() * 0.65);

      this.angle  = Math.random() * Math.PI * 2;
      this.speed  = (0.003 + 0.015 / (this.r / 60)) * (Math.random() > 0.5 ? 1 : -1);
      this.size   = 0.5 + Math.random() * 1.8;

      const t = 1 - (this.r - minR) / (maxR - minR); // 0 = far, 1 = near

      // Dark mode palette: purple → pink
      const hueD = 240 + t * 60;
      const satD = 80 + t * 20;
      const lgtD = 55 + t * 30;
      this.colorDark  = `hsl(${hueD},${satD}%,${lgtD}%)`;

      // Light mode palette: warm amber → golden-orange
      const hueL = 30 + t * 20;   // 30 orange → 50 gold
      const satL = 85 + t * 15;
      const lgtL = 45 + t * 15;
      this.colorLight = `hsl(${hueL},${satL}%,${lgtL}%)`;

      this.alpha  = 0.3 + t * 0.7;
      this.tiltX  = 0.22 + Math.random() * 0.15;
      this.trail  = [];
    }

    update() {
      this.angle += this.speed;
      this.r -= 0.06 + 0.12 * (1 - this.r / 300);
      if (this.r < 38) { this.reset(false); return; }

      const x = cx + Math.cos(this.angle) * this.r;
      const y = cy + Math.sin(this.angle) * this.r * this.tiltX;

      this.trail.unshift({ x, y, a: this.alpha });
      if (this.trail.length > 12) this.trail.pop();
    }

    draw(isLight) {
      if (this.trail.length < 2) return;
      const color = isLight ? this.colorLight : this.colorDark;

      // Trail
      for (let i = 1; i < this.trail.length; i++) {
        const fade = (1 - i / this.trail.length) * this.trail[0].a * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.strokeStyle = color.replace(')', `,${fade})`).replace('hsl', 'hsla');
        ctx.lineWidth = this.size * (1 - i / this.trail.length);
        ctx.stroke();
      }

      // Head dot
      const { x, y } = this.trail[0];
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', `,${this.alpha})`).replace('hsl', 'hsla');
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new BHParticle());
  }

  /* ---- accretion-disk angle ---- */
  let diskAngle = 0;

  /* ---- main render ---- */
  function render() {
    ctx.clearRect(0, 0, W, H);

    // ── Detect current theme ──────────────────────────────────
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // ── Solid base fill ───────────────────────────────────────
    ctx.fillStyle = isLight ? '#f8faff' : '#000';
    ctx.fillRect(0, 0, W, H);

    // ── Central ambient glow ──────────────────────────────────
    const space = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
    if (isLight) {
      space.addColorStop(0,   'rgba(99,102,241,0.08)');
      space.addColorStop(0.4, 'rgba(139,92,246,0.04)');
      space.addColorStop(1,   'rgba(248,250,255,0)');
    } else {
      space.addColorStop(0,   'rgba(15,5,40,0.0)');
      space.addColorStop(0.5, 'rgba(5,0,20,0.3)');
      space.addColorStop(1,   'rgba(0,0,0,0.6)');
    }
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, W, H);

    // ── Outer gravitational-lensing rings ─────────────────────
    const rings = [
      { r: 210, alpha: isLight ? 0.08  : 0.04 },
      { r: 170, alpha: isLight ? 0.12  : 0.07 },
      { r: 140, alpha: isLight ? 0.16  : 0.10 },
      { r: 115, alpha: isLight ? 0.20  : 0.13 },
    ];
    rings.forEach(({ r, alpha }) => {
      const gr = ctx.createRadialGradient(cx, cy, r - 12, cx, cy, r + 12);
      if (isLight) {
        gr.addColorStop(0,   `rgba(245,158,11,0)`);
        gr.addColorStop(0.5, `rgba(245,158,11,${alpha})`);
        gr.addColorStop(1,   `rgba(245,158,11,0)`);
      } else {
        gr.addColorStop(0,   `rgba(100,80,255,0)`);
        gr.addColorStop(0.5, `rgba(130,80,255,${alpha})`);
        gr.addColorStop(1,   `rgba(100,80,255,0)`);
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = gr;
      ctx.lineWidth = 22;
      ctx.stroke();
    });

    // ── Spinning accretion disk ───────────────────────────────
    diskAngle += 0.004;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(diskAngle);

    const diskW = 200, diskH = 38;
    const diskGrad = ctx.createLinearGradient(-diskW, 0, diskW, 0);
    if (isLight) {
      diskGrad.addColorStop(0,    'rgba(245,158,11,0)');
      diskGrad.addColorStop(0.2,  'rgba(251,191,36,0.25)');
      diskGrad.addColorStop(0.42, 'rgba(253,224,71,0.5)');
      diskGrad.addColorStop(0.5,  'rgba(254,240,138,0.65)');
      diskGrad.addColorStop(0.58, 'rgba(253,224,71,0.5)');
      diskGrad.addColorStop(0.8,  'rgba(251,191,36,0.25)');
      diskGrad.addColorStop(1,    'rgba(245,158,11,0)');
    } else {
      diskGrad.addColorStop(0,    'rgba(255,120,40,0)');
      diskGrad.addColorStop(0.2,  'rgba(255,160,60,0.18)');
      diskGrad.addColorStop(0.42, 'rgba(255,220,120,0.42)');
      diskGrad.addColorStop(0.5,  'rgba(255,255,220,0.55)');
      diskGrad.addColorStop(0.58, 'rgba(255,220,120,0.42)');
      diskGrad.addColorStop(0.8,  'rgba(255,160,60,0.18)');
      diskGrad.addColorStop(1,    'rgba(255,120,40,0)');
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, diskW, diskH, 0, 0, Math.PI * 2);
    ctx.fillStyle = diskGrad;
    ctx.fill();

    // Second disk ring
    const diskGrad2 = ctx.createLinearGradient(-diskW * 0.7, 0, diskW * 0.7, 0);
    if (isLight) {
      diskGrad2.addColorStop(0,    'rgba(254,240,138,0)');
      diskGrad2.addColorStop(0.5,  'rgba(255,255,255,0.25)'); // White center
      diskGrad2.addColorStop(1,    'rgba(254,240,138,0)');
    } else {
      diskGrad2.addColorStop(0,    'rgba(120,60,255,0)');
      diskGrad2.addColorStop(0.5,  'rgba(180,80,255,0.22)');
      diskGrad2.addColorStop(1,    'rgba(120,60,255,0)');
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, diskW * 0.7, diskH * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = diskGrad2;
    ctx.fill();

    ctx.restore();

    // ── Orbiting particles ────────────────────────────────────
    const front = [], back = [];
    particles.forEach(p => {
      const y = cy + Math.sin(p.angle) * p.r * p.tiltX;
      (y < cy ? back : front).push(p);
    });
    back.forEach(p  => { p.update(); p.draw(isLight); });

    // ── Singularity core ──────────────────────────────────────
    const bhR = 46;

    // Outer photon-sphere glow
    const psGlow = ctx.createRadialGradient(cx, cy, bhR * 0.6, cx, cy, bhR * 1.8);
    if (isLight) {
      psGlow.addColorStop(0,   'rgba(254,240,138,0.5)'); // Warm yellow glow
      psGlow.addColorStop(0.4, 'rgba(253,224,71,0.2)');
      psGlow.addColorStop(1,   'rgba(240,240,250,0)');
    } else {
      psGlow.addColorStop(0,   'rgba(120,60,255,0.5)');
      psGlow.addColorStop(0.4, 'rgba(80,20,200,0.2)');
      psGlow.addColorStop(1,   'rgba(0,0,0,0)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, bhR * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = psGlow;
    ctx.fill();

    // Photon ring
    ctx.beginPath();
    ctx.arc(cx, cy, bhR + 5, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(254,240,138,0.8)' : 'rgba(200,140,255,0.55)';
    ctx.lineWidth = isLight ? 2 : 3;
    ctx.stroke();

    // Core
    const core = ctx.createRadialGradient(cx - bhR * 0.2, cy - bhR * 0.2, 0, cx, cy, bhR);
    if (isLight) {
      core.addColorStop(0,   'rgba(255,255,255,1)'); // Bright white center
      core.addColorStop(0.6, 'rgba(254,240,138,1)'); // Creamy yellow
      core.addColorStop(1,   'rgba(253,224,71,1)');  // Golden yellow
    } else {
      core.addColorStop(0,   'rgba(30,10,60,1)');
      core.addColorStop(0.6, 'rgba(0,0,0,1)');
      core.addColorStop(1,   'rgba(0,0,0,1)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, bhR, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    // ── Front-side particles ──────────────────────────────────
    front.forEach(p => { p.update(); p.draw(isLight); });

    // ── Polar jets ───────────────────────────────────────────
    const jetLen = H * 0.38;
    [[cx, cy - bhR, cx, cy - bhR - jetLen],
     [cx, cy + bhR, cx, cy + bhR + jetLen]].forEach(([x1, y1, x2, y2]) => {
      const jet = ctx.createLinearGradient(x1, y1, x2, y2);
      if (isLight) {
        jet.addColorStop(0,   'rgba(245,158,11,0.35)');
        jet.addColorStop(0.5, 'rgba(251,191,36,0.12)');
        jet.addColorStop(1,   'rgba(253,224,71,0)');
      } else {
        jet.addColorStop(0,   'rgba(160,80,255,0.45)');
        jet.addColorStop(0.5, 'rgba(100,50,255,0.15)');
        jet.addColorStop(1,   'rgba(60,20,200,0)');
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = jet;
      ctx.lineWidth = 6 + Math.sin(Date.now() * 0.003) * 3;
      ctx.stroke();
    });

    if (running) animId = requestAnimationFrame(render);
  }

  /* ---- IntersectionObserver: only animate when visible ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!running) {
          running = true;
          resize();
          render();
        }
      } else {
        running = false;
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas.closest('.blackhole-section'));
})();

