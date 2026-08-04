document.documentElement.classList.add('js');

const DEMO_URL = 'https://example.com/demo';
const yearNode = document.querySelector('#year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

/* -------------------- Модальные окна -------------------- */
let lastFocused = null;

function openModal(modal) {
  if (!modal) return;
  lastFocused = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  window.setTimeout(() => modal.querySelector('input, textarea, select, button, a')?.focus(), 20);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.is-open')) document.body.classList.remove('modal-open');
  lastFocused?.focus();
}

const leadModal = document.querySelector('#lead-modal');
const privacyModal = document.querySelector('#privacy-modal');
const reviewModal = document.querySelector('#review-modal');

document.querySelectorAll('[data-open-modal]').forEach((element) => {
  element.addEventListener('click', () => openModal(leadModal));
});
document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', () => closeModal(leadModal));
});
document.querySelectorAll('[data-open-privacy]').forEach((element) => {
  element.addEventListener('click', () => openModal(privacyModal));
});
document.querySelectorAll('[data-close-privacy]').forEach((element) => {
  element.addEventListener('click', () => closeModal(privacyModal));
});
document.querySelectorAll('[data-open-review]').forEach((element) => {
  element.addEventListener('click', () => openModal(reviewModal));
});
document.querySelectorAll('[data-close-review]').forEach((element) => {
  element.addEventListener('click', () => closeModal(reviewModal));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.modal.is-open').forEach(closeModal);
});

/* -------------------- Мобильное меню -------------------- */
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
  mobileMenu.querySelectorAll('a,button').forEach((element) => {
    element.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* -------------------- Форма демо -------------------- */
const demoForm = document.querySelector('#demo-form');
const demoLink = document.querySelector('#demo-link');
if (demoLink) demoLink.href = DEMO_URL;

if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = demoForm.querySelector('.form-error');
    const name = demoForm.elements.name.value.trim();
    const phone = demoForm.elements.phone.value.replace(/\D/g, '');
    const consent = demoForm.querySelector('[type="checkbox"]').checked;

    if (name.length < 2) { error.textContent = 'Введите имя.'; return; }
    if (phone.length < 10) { error.textContent = 'Введите корректный номер телефона.'; return; }
    if (!consent) { error.textContent = 'Подтвердите согласие на обработку данных.'; return; }

    error.textContent = '';
    leadModal.querySelector('[data-form-state="form"]').hidden = true;
    leadModal.querySelector('[data-form-state="success"]').hidden = false;
  });

  demoForm.elements.phone.addEventListener('input', (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
    let normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    if (!normalized) { event.target.value = ''; return; }
    if (!normalized.startsWith('7')) normalized = `7${normalized}`;
    const p1 = normalized.slice(1, 4);
    const p2 = normalized.slice(4, 7);
    const p3 = normalized.slice(7, 9);
    const p4 = normalized.slice(9, 11);
    event.target.value = `+7${p1 ? ` (${p1}` : ''}${p1.length === 3 ? ') ' : ''}${p2}${p3 ? `-${p3}` : ''}${p4 ? `-${p4}` : ''}`;
  });
}

/* -------------------- Плавное появление секций -------------------- */
const revealSections = [...document.querySelectorAll('.section-reveal')];
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  revealSections.forEach((section, index) => {
    if (index === 0) section.classList.add('is-visible');
    revealObserver.observe(section);
  });
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

/* -------------------- Фильтры заявок -------------------- */
document.querySelectorAll('.lead-tabs, .mobile-status-grid').forEach((group) => {
  group.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });
});

/* -------------------- Точная навигация по полноэкранным блокам -------------------- */
const pageScroller = document.querySelector('#page-scroller');
const desktopSnapMedia = window.matchMedia('(min-width: 1100px) and (min-height: 800px)');
const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const figmaExportMode = document.documentElement.classList.contains('figma-export');
const getHeaderHeight = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
const getSnapSections = () => [...document.querySelectorAll('#page-scroller > .snap-section')];
const strictSnapEnabled = () => desktopSnapMedia.matches && !figmaExportMode;

function setActiveSection(index) {
  getSnapSections().forEach((section, sectionIndex) => {
    const active = sectionIndex === index;
    section.classList.toggle('is-active', active);
    section.classList.toggle('is-visible', active || section.classList.contains('is-visible'));
    section.setAttribute('aria-current', active ? 'true' : 'false');
  });
}

function getCurrentSectionIndex() {
  const sections = getSnapSections();
  if (!sections.length) return 0;
  if (strictSnapEnabled() && pageScroller) {
    const y = pageScroller.scrollTop;
    return sections.reduce((best, section, index) => (
      Math.abs(section.offsetTop - y) < Math.abs(sections[best].offsetTop - y) ? index : best
    ), 0);
  }
  const targetLine = getHeaderHeight() + window.innerHeight * 0.3;
  return sections.reduce((best, section, index) => (
    Math.abs(section.getBoundingClientRect().top - targetLine) < Math.abs(sections[best].getBoundingClientRect().top - targetLine) ? index : best
  ), 0);
}

function scrollToSection(section, behavior = 'smooth') {
  if (!section) return;
  const motion = reduceMotionMedia.matches ? 'auto' : behavior;
  if (strictSnapEnabled() && pageScroller) {
    pageScroller.scrollTo({ top: section.offsetTop, behavior: motion });
  } else {
    const targetTop = window.scrollY + section.getBoundingClientRect().top - getHeaderHeight();
    window.scrollTo({ top: Math.max(0, targetTop), behavior: motion });
  }
}

function activateNearestSection() {
  setActiveSection(getCurrentSectionIndex());
}

getSnapSections().forEach((section, index) => {
  section.dataset.snapIndex = String(index);
});
setActiveSection(0);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target || !target.classList.contains('snap-section')) return;
    event.preventDefault();
    const index = getSnapSections().indexOf(target);
    if (index >= 0) setActiveSection(index);
    scrollToSection(target);
    history.replaceState(null, '', href);
  });
});

let snapLocked = false;
let wheelAccumulator = 0;
let snapUnlockTimer = null;

function handleSectionWheel(event) {
  if (!strictSnapEnabled() || reduceMotionMedia.matches) return;
  if (document.querySelector('.modal.is-open')) return;
  if (event.target.closest('.modal-dialog, .review-carousel, input, textarea, select, details')) return;
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

  event.preventDefault();
  wheelAccumulator += event.deltaY;
  if (snapLocked || Math.abs(wheelAccumulator) < 24) return;

  const direction = wheelAccumulator > 0 ? 1 : -1;
  wheelAccumulator = 0;
  const sections = getSnapSections();
  const currentIndex = getCurrentSectionIndex();
  const targetIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
  if (targetIndex === currentIndex) return;

  snapLocked = true;
  setActiveSection(targetIndex);
  scrollToSection(sections[targetIndex]);
  window.clearTimeout(snapUnlockTimer);
  snapUnlockTimer = window.setTimeout(() => { snapLocked = false; }, 760);
}

pageScroller?.addEventListener('wheel', handleSectionWheel, { passive: false });

pageScroller?.addEventListener('scroll', () => {
  if (!strictSnapEnabled() || snapLocked) return;
  window.requestAnimationFrame(activateNearestSection);
}, { passive: true });
window.addEventListener('scroll', () => {
  if (strictSnapEnabled()) return;
  window.requestAnimationFrame(activateNearestSection);
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (!strictSnapEnabled() || document.querySelector('.modal.is-open')) return;
  if (!['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  if (event.target.matches('input, textarea, select, button')) return;
  event.preventDefault();
  const sections = getSnapSections();
  const currentIndex = getCurrentSectionIndex();
  let targetIndex = currentIndex;
  if (['PageDown', 'ArrowDown'].includes(event.key)) targetIndex += 1;
  if (['PageUp', 'ArrowUp'].includes(event.key)) targetIndex -= 1;
  if (event.key === 'Home') targetIndex = 0;
  if (event.key === 'End') targetIndex = sections.length - 1;
  targetIndex = Math.min(Math.max(targetIndex, 0), sections.length - 1);
  setActiveSection(targetIndex);
  scrollToSection(sections[targetIndex]);
});

function syncSnapMode() {
  window.clearTimeout(snapUnlockTimer);
  snapLocked = false;
  wheelAccumulator = 0;
  const sections = getSnapSections();
  if (!sections.length) return;
  if (strictSnapEnabled() && pageScroller) {
    const hashTarget = location.hash && document.querySelector(location.hash);
    const target = hashTarget?.classList.contains('snap-section') ? hashTarget : sections[getCurrentSectionIndex()] || sections[0];
    pageScroller.scrollTo({ top: target.offsetTop, behavior: 'auto' });
    setActiveSection(sections.indexOf(target));
  } else {
    activateNearestSection();
  }
}

desktopSnapMedia.addEventListener?.('change', syncSnapMode);
window.addEventListener('resize', () => window.setTimeout(syncSnapMode, 60));
window.addEventListener('load', syncSnapMode);

/* -------------------- Отзывы: нативный горизонтальный скролл -------------------- */
const reviewCarousel = document.querySelector('[data-review-carousel]');
const reviewTrack = document.querySelector('[data-review-track]');
const reviewDots = document.querySelector('[data-review-dots]');
const reviewPrev = document.querySelector('[data-review-prev]');
const reviewNext = document.querySelector('[data-review-next]');
let reviewIndex = 0;

function getReviewCards() {
  return reviewTrack ? [...reviewTrack.querySelectorAll('.review-card')] : [];
}

function getClosestReviewIndex() {
  if (!reviewCarousel) return 0;
  const cards = getReviewCards();
  let closest = 0;
  let distance = Number.POSITIVE_INFINITY;
  cards.forEach((card, index) => {
    const cardDistance = Math.abs(card.offsetLeft - reviewCarousel.scrollLeft);
    if (cardDistance < distance) { distance = cardDistance; closest = index; }
  });
  return closest;
}

function createReviewDots() {
  if (!reviewDots) return;
  reviewDots.innerHTML = '';
  getReviewCards().forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
    dot.addEventListener('click', () => scrollReview(index));
    reviewDots.append(dot);
  });
}

function updateReviewControls() {
  const cards = getReviewCards();
  reviewIndex = Math.min(Math.max(reviewIndex, 0), Math.max(0, cards.length - 1));
  [...(reviewDots?.children || [])].forEach((dot, index) => dot.classList.toggle('active', index === reviewIndex));
  if (reviewPrev) reviewPrev.disabled = reviewIndex === 0;
  if (reviewNext) reviewNext.disabled = reviewIndex >= cards.length - 1;
}

function scrollReview(index, behavior = 'smooth') {
  if (!reviewCarousel) return;
  const cards = getReviewCards();
  reviewIndex = Math.min(Math.max(index, 0), Math.max(0, cards.length - 1));
  const card = cards[reviewIndex];
  reviewCarousel.scrollTo({ left: card?.offsetLeft || 0, behavior: reduceMotionMedia.matches ? 'auto' : behavior });
  updateReviewControls();
}

reviewPrev?.addEventListener('click', () => scrollReview(reviewIndex - 1));
reviewNext?.addEventListener('click', () => scrollReview(reviewIndex + 1));
reviewCarousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); scrollReview(reviewIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); scrollReview(reviewIndex + 1); }
});

let reviewScrollTimer;
reviewCarousel?.addEventListener('scroll', () => {
  window.clearTimeout(reviewScrollTimer);
  reviewScrollTimer = window.setTimeout(() => {
    reviewIndex = getClosestReviewIndex();
    updateReviewControls();
  }, 80);
}, { passive: true });

function bindReviewMoreButtons(scope = document) {
  scope.querySelectorAll('[data-review-more]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const card = button.closest('.review-card');
      const expanded = card.classList.toggle('is-expanded');
      button.textContent = expanded ? 'Свернуть' : 'Читать полностью';
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function getInitials(name) {
  return String(name).trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'TMS';
}

function createReviewCard(review) {
  const article = document.createElement('article');
  article.className = 'review-card';
  const rating = Math.min(Math.max(Number(review.rating || 5), 1), 5);
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  article.innerHTML = `
    <div class="review-card-head">
      <span class="review-avatar review-avatar-initials" aria-hidden="true">${escapeHtml(getInitials(review.name))}</span>
      <div><strong>${escapeHtml(review.name)}</strong><small>${escapeHtml(review.role)}</small></div>
      <span class="review-rating" aria-label="${rating} из 5">${stars}</span>
    </div>
    <p class="review-text" data-review-text>${escapeHtml(review.text)}</p>
    <button class="review-more" type="button" data-review-more>Читать полностью</button>
    <footer><span>Отзыв клиента</span><time>${new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</time></footer>`;
  return article;
}

const reviewStorageKey = 'tms-user-reviews-v2';
function loadSavedReviews() {
  if (!reviewTrack) return;
  try {
    const saved = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
    saved.slice().reverse().forEach((review) => reviewTrack.prepend(createReviewCard(review)));
  } catch (error) {
    console.warn('Не удалось прочитать локальные отзывы.', error);
  }
}

const reviewForm = document.querySelector('#review-form');
reviewForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const error = reviewForm.querySelector('.form-error');
  const review = {
    name: reviewForm.elements.reviewName.value.trim(),
    role: reviewForm.elements.reviewRole.value.trim(),
    text: reviewForm.elements.reviewText.value.trim(),
    rating: reviewForm.elements.reviewRating.value
  };
  if (review.name.length < 2) { error.textContent = 'Укажите имя.'; return; }
  if (review.role.length < 2) { error.textContent = 'Укажите должность или компанию.'; return; }
  if (review.text.length < 15) { error.textContent = 'Напишите отзыв чуть подробнее.'; return; }
  error.textContent = '';

  reviewTrack.prepend(createReviewCard(review));
  try {
    const saved = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
    saved.unshift(review);
    localStorage.setItem(reviewStorageKey, JSON.stringify(saved.slice(0, 20)));
  } catch (storageError) {
    console.warn('Не удалось сохранить отзыв локально.', storageError);
  }

  reviewForm.reset();
  bindReviewMoreButtons(reviewTrack);
  createReviewDots();
  scrollReview(0, 'auto');
  closeModal(reviewModal);
});

loadSavedReviews();
bindReviewMoreButtons();
createReviewDots();
scrollReview(0, 'auto');

let resizeTimer;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    reviewIndex = getClosestReviewIndex();
    updateReviewControls();
  }, 120);
});
