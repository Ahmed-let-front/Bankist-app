'use strict';
import './css/style.css';
const elements = {
  html: document.documentElement,
  modal: document.querySelector('.modal'),
  btnCloseModal: document.querySelector('.btn--close-modal'),
  btnsOpenModal: document.querySelectorAll('.btn--show-modal'),
  barBtn: document.querySelector('.bar__btn'),
  nav: document.querySelector('.nav'),
  overlay: document.querySelector('.overlay__el'),
  navItme: document.querySelector('.nav__item'),
  operationContainerTab: document.querySelector('.operations__tab-container'),
  operations: document.querySelector('.operations'),
  header: document.querySelector('.header-nav'),
  heroSection: document.getElementById('hero__section'),
  featuresSection: document.getElementById('features__section'),
  operationSection: document.getElementById('operations__section'),
  testimonialsSection: document.getElementById('testimonials__section'),
  slider: document.querySelector('.slider'),
  slides: document.querySelectorAll('.slide'),
  maxSlides: document.querySelectorAll('.slide').length,
  dot: document.querySelector('.dot'),
  inputFirstName: document.getElementById('first-name'),
  inputLastName: document.getElementById('last-name'),
  inputPIN: document.getElementById('pin'),
  btnSignIn: document.querySelector('.btn-sign-in'),
  thortting: false,
  lastScrollY: 0,
  slideNumber: 0,
};
elements.barBtn.addEventListener('click', () => {
  elements.nav.classList.toggle('hidden-nav');
  elements.nav.classList.add('max-xl:transition-transform', 'max-xl:duration-500');
  elements.overlay.classList.toggle('overlay');
});
elements.overlay.addEventListener('click', () => {
  elements.nav.classList.add('hidden-nav');
  elements.overlay.classList.remove('overlay', 'overlay--btn');
});
const openModal = () => {
  elements.modal.classList.remove('hidden-content');
  elements.modal.classList.add('duration-500', 'transition-[opacity,translate]', '-translate-y-1/2');
  elements.overlay.classList.add('overlay--btn');
};
const closeModal = function () {
  elements.modal.classList.add('hidden-content');
  elements.modal.classList.remove('-translate-y-1/2');
  elements.overlay.classList.remove('overlay--btn');
};
elements.btnsOpenModal.forEach((el, i) => elements.btnsOpenModal[i].addEventListener('click', openModal));
elements.btnCloseModal.addEventListener('click', closeModal);
elements.overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  e.key === 'Escape' && !elements.modal.classList.contains('hidden-content') && closeModal();
});
const processContainer = e => {
  const btnTabed = e.target.closest('.operations__tab').dataset.tab;
  const operationCurrContent = document.querySelector(`.operations__content--${btnTabed}`);
  const nodeListContainers = document.querySelectorAll('.operations__content');
  return { operationCurrContent, nodeListContainers };
};
elements.operationContainerTab.addEventListener('click', function (e) {
  if (!e.target.closest('.operations__tab')) return;
  const { operationCurrContent, nodeListContainers } = processContainer(e);
  nodeListContainers.forEach(el => {
    el.classList.remove('operations__content--active');
  });
  operationCurrContent.classList.add('operations__content--active');
});
const processAnimateNav = e => ({
  currTarget: e.target,
  siblings: e.target.closest('.nav').querySelectorAll('.nav__link'),
});
const displayAnimateNav = function (rateOpacity, e) {
  if (!e.target.classList.contains('nav__link')) return;
  const { currTarget, siblings } = processAnimateNav(e);
  siblings.forEach(el => {
    if (el === currTarget) return;
    el.style.opacity = rateOpacity;
  });
};
elements.nav.addEventListener('mouseover', displayAnimateNav.bind(null, 0.5));
elements.nav.addEventListener('mouseout', displayAnimateNav.bind(null, 1));
window.addEventListener(
  'scroll',
  () => {
    if (elements.thortting) return;
    elements.thortting = true;
    const currentScroll = window.scrollY;
    window.requestAnimationFrame(() => {
      if (currentScroll > elements.lastScrollY) elements.header.classList.add('header-leave');
      else elements.header.classList.remove('header-leave');
      elements.lastScrollY = currentScroll;
      elements.thortting = false;
    });
  },
  { passive: true },
);
const allSections = document.querySelectorAll('.section');
const funObSection = (enteries, observer) => {
  enteries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section-animate');
    observer.unobserve(entry.target);
  });
};
const obSections = new IntersectionObserver(funObSection, { root: null, threshold: 0.2 });
allSections.forEach(sec => {
  sec.classList.add('section-animate');
});
allSections.forEach(sec => obSections.observe(sec));
const funObImg = (enteries, observer) => {
  enteries.forEach(entry => {
    const imgTarget = entry.target;
    if (!entry.isIntersecting) return;
    imgTarget.src = imgTarget.dataset.src;
    imgTarget.addEventListener('load', () => imgTarget.classList.remove('lazy-img'));
    imgTarget.removeAttribute('data-src');
    observer.unobserve(imgTarget);
  });
};
const allLazyImg = document.querySelectorAll('.lazy-img');
const imgObserver = new IntersectionObserver(funObImg, { root: null, threshold: 0, rootMargin: '-100px' });
allLazyImg.forEach(img => imgObserver.observe(img));
const createDots = activeDot => {
  let dotHTML = '';
  elements.slides.forEach((_, i) => {
    dotHTML += `<button class="dot" aria-label="button-slide--${i + 1}" data-slide="${i}"></button>`;
  });
  document.querySelector('.dots').insertAdjacentHTML('beforeend', dotHTML);
  return document.querySelectorAll('.dot');
};
const updateSlider = activeIndex => {
  elements.slides.forEach((slide, i) => (slide.style.translate = `${130 * (i - activeIndex)}%`));
};
const updateDots = activeIndex => {
  if (!elements.allDots) return;
  elements.allDots.forEach(dot => dot.classList.remove('dot--active'));
  document.querySelector(`[data-slide="${activeIndex}"]`).classList.add('dot--active');
};
const displayUi = activeIndex => {
  updateSlider(activeIndex);
  updateDots(activeIndex);
};
const processBtnRightSlider = () => {
  if (elements.slideNumber === elements.maxSlides - 1) elements.slideNumber = 0;
  else elements.slideNumber++;
  displayUi(elements.slideNumber);
};
const processBtnLeftSlider = () => {
  if (elements.slideNumber === 0) elements.slideNumber = elements.maxSlides - 1;
  else elements.slideNumber--;
  displayUi(elements.slideNumber);
};
const dotsOperation = e => {
  const dotClickedTab = +e.target.dataset.slide;
  displayUi(dotClickedTab);
};
elements.allDots = createDots(elements.slideNumber);
displayUi(elements.slideNumber);
elements.slider.addEventListener('click', e => {
  if (e.target.closest('.slider__btn--right')?.classList.contains('slider__btn')) processBtnRightSlider();
  else if (e.target.closest('.slider__btn--left')?.classList.contains('slider__btn')) processBtnLeftSlider();
  else if (e.target.classList.contains('dot')) dotsOperation(e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') processBtnRightSlider();
  else if (e.key === 'ArrowLeft') processBtnLeftSlider();
});
const initData = e => {
  e.preventDefault();
  if (elements.inputFirstName.value === '' || elements.inputLastName.value === '' || elements.inputPIN.value < 4) {
    return;
  }
  const UserSignInData = {
    fullName: `${elements.inputFirstName.value.trim()} ${elements.inputLastName.value.trim()}`,
    PINValue: +elements.inputPIN.value,
  };
  elements.btnsOpenModal.forEach(el => (el.textContent = 'TO App Page'));
  localStorage.setItem('registeredUser', JSON.stringify(UserSignInData));
  window.location.href = 'account.html';
};
elements.btnSignIn.addEventListener('click', initData);
