/**
 * ========================================================
 * main.js — Recognized IT Service & Solution Pvt. Ltd.
 * Global Navigation, WhatsApp click, basic UI state
 * Cart is also initialized here for cross-page counting
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== HERO IMAGE SLIDER =====
  const heroSlider = document.getElementById('heroSlider');
  const heroTrack = heroSlider?.querySelector('.hero-slider__track');

  if (heroSlider && heroTrack) {
    const slides = Array.from(heroTrack.querySelectorAll('.hero-slider__img'));

    if (slides.length > 1) {
      const makeClone = slide => {
        const clone = slide.cloneNode(true);
        clone.alt = '';
        clone.loading = 'eager';
        clone.setAttribute('aria-hidden', 'true');
        return clone;
      };

      heroTrack.prepend(makeClone(slides[slides.length - 1]));
      heroTrack.appendChild(makeClone(slides[0]));

      const slideCount = slides.length + 2;
      heroTrack.style.setProperty('--slide-count', slideCount);
      let currentSlide = 1;
      let loopResetTimer;

      const updatePosition = () => {
        heroTrack.style.transform = `translateX(-${currentSlide * (100 / slideCount)}%)`;
      };

      const resetFromClone = () => {
        if (currentSlide !== 0 && currentSlide !== slideCount - 1) return;

        window.clearTimeout(loopResetTimer);
        currentSlide = currentSlide === 0 ? slides.length : 1;
        heroTrack.classList.add('is-resetting');
        updatePosition();
        void heroTrack.offsetWidth;
        heroTrack.classList.remove('is-resetting');
      };

      const showSlide = index => {
        window.clearTimeout(loopResetTimer);
        currentSlide = index;
        updatePosition();

        if (currentSlide === 0 || currentSlide === slideCount - 1) {
          const duration = getComputedStyle(heroTrack).transitionDuration.split(',')[0].trim();
          const durationMs = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
          loopResetTimer = window.setTimeout(resetFromClone, durationMs + 50);
        }
      };

      heroTrack.classList.add('is-resetting');
      updatePosition();
      void heroTrack.offsetWidth;
      heroTrack.classList.remove('is-resetting');

      heroTrack.addEventListener('transitionend', event => {
        if (event.target === heroTrack && event.propertyName === 'transform') resetFromClone();
      });

      window.setInterval(() => showSlide(currentSlide + 1), 4000);
    }
  }

  // ===== NAVBAR HAMBURGER MENU =====
  const hamburger = document.getElementById('navbarHamburger');
  const mobileMenu = document.getElementById('navbarMobile');

  if (hamburger && mobileMenu) {
    const setMobileMenuOpen = isOpen => {
      hamburger.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      setMobileMenuOpen(!mobileMenu.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !hamburger.contains(e.target) &&
          !mobileMenu.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMobileMenuOpen(false);
        hamburger.focus();
      }
    });
  }

  // ===== SCROLL-DEPENDENT UI =====
  const scrollTopBtn = document.getElementById('scrollTop');
  const navbar = document.querySelector('.navbar');

  if (scrollTopBtn || navbar) {
    const updateScrollUi = () => {
      if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
      if (navbar) {
        navbar.style.boxShadow = window.scrollY > 0
          ? '0 4px 16px rgba(0,0,0,0.08)'
          : '0 2px 12px rgba(0,0,0,0.06)';
      }
    };

    window.addEventListener('scroll', updateScrollUi, { passive: true });
    updateScrollUi();
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== INITIATE CART BADGE =====
  updateCartBadge();
});

// ===== GLOBAL CART LOGIC (LOCALSTORAGE) ===== //
function getCart() {
  try {
    const storedCart = localStorage.getItem('recognized_cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];

    if (!Array.isArray(cart)) return [];

    return cart
      .filter(item => item && typeof item.id === 'string' && typeof item.name === 'string' &&
        Number.isFinite(Number(item.price)) && Number(item.price) >= 0 &&
        Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0)
      .map(item => ({
        ...item,
        price: Number(item.price),
        quantity: Math.max(1, Math.floor(Number(item.quantity)))
      }));
  } catch {
    return [];
  }
}

function addToCart(product) {
  if (!product || typeof product.id !== 'string' || typeof product.name !== 'string' ||
      !Number.isFinite(Number(product.price)) || Number(product.price) < 0) return;

  const quantity = Math.max(1, Math.floor(Number(product.quantity) || 1));
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...product,
      price: Number(product.price),
      quantity
    });
  }

  localStorage.setItem('recognized_cart', JSON.stringify(cart));
  updateCartBadge();
  showCartToast(`Added ${product.name} to cart`);
}

let cartToastTimer;

function showCartToast(message) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  window.clearTimeout(cartToastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  cartToastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function updateCartBadge() {
  const cart = getCart();
  const badges = document.querySelectorAll('.navbar__cart-count');

  let totalItems = 0;
  cart.forEach(item => {
    totalItems += item.quantity;
  });

  badges.forEach(badge => {
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  });
}
