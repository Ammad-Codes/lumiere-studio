/* =========================================================
   LUMIÈRE STUDIO – script.js
   Vanilla JavaScript. Runs once the HTML is ready.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Check user preferences once
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Text setup must run before the loader ends
  initLetterSplit();
  initSplitHeadings();

  initLoader(reduceMotion);
  initNavbar();
  initProgressAndTop();
  initMobileMenu();
  initHeroSlider();
  initReveal(reduceMotion);
  initStagger();
  initGallery();
  initLightbox();
  initCounters(reduceMotion);
  initParallax(reduceMotion);
  initCompare();
  initTilt(reduceMotion, finePointer);
  initTestimonials();
  initInstaHearts();
  initRipple();
  initCursor(reduceMotion, finePointer);
  initForms();
  initFooter();
});

/* ---------- 1. Loader: aperture closes, page slides up ---------- */
function initLoader(reduceMotion) {
  const loader = document.getElementById('loader');
  const main = document.getElementById('main');
  const wait = reduceMotion ? 300 : 2000;

  setTimeout(() => {
    loader.classList.add('shutter');             // shutter opens the page
    main.classList.add('ready');                 // page slides up
    document.getElementById('heroTitle').classList.add('in-view');
    setTimeout(() => loader.classList.add('done'), 1100);
  }, wait);
}

/* ---------- 2. Hero headline: letter by letter ---------- */
function initLetterSplit() {
  const title = document.getElementById('heroTitle');
  const text = title.textContent.trim();
  const words = text.split(' ');
  title.setAttribute('aria-label', text);
  title.textContent = '';

  let letterIndex = 0;
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.setAttribute('aria-hidden', 'true');

    [...word].forEach((char) => {
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = char;
      letter.style.setProperty('--d', `${letterIndex * 35}ms`);
      wordSpan.appendChild(letter);
      letterIndex++;
    });

    title.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      title.appendChild(document.createTextNode(' '));
    }
  });
}

/* ---------- 3. Section headings: words slide up ---------- */
function initSplitHeadings() {
  document.querySelectorAll('.split-heading').forEach((heading) => {
    const text = heading.textContent.trim();
    const words = text.split(/\s+/);
    heading.setAttribute('aria-label', text);
    heading.textContent = '';

    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'word-wrap';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.setAttribute('aria-hidden', 'true');
      inner.textContent = word;
      inner.style.setProperty('--d', `${i * 90}ms`);
      wrap.appendChild(inner);
      heading.appendChild(wrap);
      heading.appendChild(document.createTextNode(' '));
    });
  });
}

/* ---------- 4. Navbar: glass effect after scrolling ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ---------- 5. Scroll progress bar + back-to-top ---------- */
function initProgressAndTop() {
  const bar = document.getElementById('progress');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    bar.style.width = `${percent}%`;
    toTop.classList.toggle('show', window.scrollY > 600);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
}

/* ---------- 6. Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

/* ---------- 7. Hero slider (Ken Burns via CSS) ---------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('#heroSlider .slide');
  const dotsWrap = document.getElementById('heroDots');
  let current = 0;

  const dots = [...slides].map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => show((current + 1) % slides.length), 6000);
}

/* ---------- 8. Scroll reveal (IntersectionObserver) ---------- */
function initReveal(reduceMotion) {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-img, .split-heading');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* ---------- 9. Staggered children ---------- */
function initStagger() {
  document.querySelectorAll('.stagger').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--stagger', `${i * 120}ms`));
  });
  document.querySelectorAll('.gallery-item').forEach((item, i) => item.style.setProperty('--stagger', `${(i % 3) * 120}ms`));
}

/* ---------- 10. Gallery filter ---------- */
function initGallery() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      const filter = btn.dataset.filter;
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hide', !match);
        item.classList.remove('pop');
        if (match) {
          void item.offsetWidth;          // restart animation
          item.classList.add('pop', 'in-view');
        }
      });
    });
  });
}

/* ---------- 11. Lightbox ---------- */
function initLightbox() {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');
  const items = [...document.querySelectorAll('.gallery-item')];
  let index = 0;
  let lastFocus = null;

  const visible = () => items.filter((item) => !item.classList.contains('hide'));

  function show(item) {
    img.src = item.dataset.full;
    img.alt = item.querySelector('img').alt;
    caption.textContent = item.querySelector('h3').textContent;
  }
  function open(item) {
    lastFocus = document.activeElement;
    index = visible().indexOf(item);
    show(item);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.getElementById('lbClose').focus();
  }
  function close() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }
  function step(dir) {
    const list = visible();
    index = (index + dir + list.length) % list.length;
    show(list[index]);
  }

  items.forEach((item) => {
    item.addEventListener('click', () => open(item));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(item); }
    });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => step(-1));
  document.getElementById('lbNext').addEventListener('click', () => step(1));
  box.addEventListener('click', (event) => { if (event.target === box) close(); });
  document.addEventListener('keydown', (event) => {
    if (!box.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
}

/* ---------- 12. Animated counters ---------- */
function initCounters(reduceMotion) {
  const counters = document.querySelectorAll('.counter');

  const run = (el) => {
    const target = Number(el.dataset.target);
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { run(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
}

/* ---------- 13. Parallax image ---------- */
function initParallax(reduceMotion) {
  if (reduceMotion) return;
  const wraps = document.querySelectorAll('.parallax-wrap');
  let ticking = false;

  const update = () => {
    wraps.forEach((wrap) => {
      const rect = wrap.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.12;
      wrap.querySelector('.parallax-img').style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- 14. Before / after slider ---------- */
function initCompare() {
  const compare = document.getElementById('compare');
  const range = document.getElementById('compareRange');
  const update = () => compare.style.setProperty('--pos', `${range.value}%`);
  range.addEventListener('input', update);
  update();
}

/* ---------- 15. Pricing tilt ---------- */
function initTilt(reduceMotion, finePointer) {
  if (reduceMotion || !finePointer) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- 16. Testimonials carousel ---------- */
function initTestimonials() {
  const wrap = document.getElementById('testiWrap');
  const track = document.getElementById('testiTrack');
  const dots = document.querySelectorAll('.testi-dot');
  const total = track.children.length;
  let current = 0;
  let timer = null;

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  const play = () => {
    clearInterval(timer);
    timer = setInterval(() => goToSlide((current + 1) % total), 5000);
  };
  const pause = () => clearInterval(timer);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  wrap.addEventListener('mouseenter', pause);
  wrap.addEventListener('mouseleave', play);
  play();
}

/* ---------- 17. Instagram strip: like toggle ---------- */
function initInstaHearts() {
  document.querySelectorAll('.insta-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      const liked = tile.getAttribute('aria-pressed') === 'true';
      tile.setAttribute('aria-pressed', String(!liked));
    });
  });
}

/* ---------- 18. Button ripple on click ---------- */
function initRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ---------- 19. Custom gold cursor ---------- */
function initCursor(reduceMotion, finePointer) {
  const cursor = document.getElementById('cursor');

  if (reduceMotion || !finePointer) {
    cursor.remove();
    return;
  }

  document.body.classList.add('custom-cursor');

  document.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.addEventListener('mouseover', (event) => {
    const overInteractive = Boolean(event.target.closest('a, button, img, .js-grow'));
    cursor.classList.toggle('grow', overInteractive);
  });
}

/* ---------- 20. Forms: booking + newsletter ---------- */
function initForms() {
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;

    success.classList.add('show');
    form.reset();
    setTimeout(() => success.classList.remove('show'), 3500);
  });

  success.addEventListener('click', () => success.classList.remove('show'));

  // Clear the red border once the user types again
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('invalid'));
    field.addEventListener('change', () => field.classList.remove('invalid'));
  });

  const newsletter = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  newsletter.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = newsletter.querySelector('input[type="email"]');

    if (!isValidEmail(emailInput.value)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      return;
    }
    newsletterMsg.textContent = 'Thank you! You are now on our list.';
    newsletter.reset();
  });
}

/* Returns true when every required field is filled and the email is valid */
function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    const empty = field.value.trim() === '';
    field.classList.toggle('invalid', empty);
    if (empty) valid = false;
  });

  const email = form.querySelector('input[type="email"]');
  if (email && !isValidEmail(email.value)) {
    email.classList.add('invalid');
    valid = false;
  }

  return valid;
}

/* Returns true for a simple, valid email format */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/* ---------- 21. Footer year ---------- */
function initFooter() {
  document.getElementById('year').textContent = new Date().getFullYear();
}
