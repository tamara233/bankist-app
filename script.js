'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')

const operationsContainer = document.querySelector('.operations__tab-container') // whole container
const tabsBtn = document.querySelectorAll('.operations__tab') //buttons
const operationsContent = document.querySelectorAll('.operations__content') // content

const nav = document.querySelector('.nav')
const header = document.querySelector('.header')
const sections = document.querySelectorAll('.section')
const imgs = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots')


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', (e) => {
  // e.preventDefault();
  section1.scrollIntoView({
    behavior: 'smooth'
  })
})

// Navigation smooth scroll
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.className === 'nav__link') {
    const elem = e.target.getAttribute('href')
    document.querySelector(elem).scrollIntoView({
      behavior: 'smooth'
    })
  }
})

// Tab component
operationsContainer.addEventListener('click', function (e) {
  const selected = e.target.closest('.operations__tab')

  if (!selected) return

  // Removing active classes 
  tabsBtn.forEach(tab => tab.classList.remove('operations__tab--active'))
  operationsContent.forEach(content => content.classList.remove('operations__content--active'))

  // Activating selected tab
  selected.classList.add('operations__tab--active')
  document.querySelector(`.operations__content--${selected.dataset.tab}`).classList.add('operations__content--active')
})

// Menu Animation
const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}

nav.addEventListener('mouseover', hoverHandler.bind(0.5))
nav.addEventListener('mouseout', hoverHandler.bind(1))

const navHeight = nav.getBoundingClientRect().height
const stickyNav = function (entries) {
  const [entry] = entries

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky')
}
const headerOpts = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}
const headerObserver = new IntersectionObserver(stickyNav, headerOpts)
headerObserver.observe(header)

// Section display
const displaySection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}
const sectionObs = new IntersectionObserver(displaySection, {
  root: null,
  threshold: 0.15,
})

sections.forEach(sec => {
  sectionObs.observe(sec); //sec is the target 
  sec.classList.add('section--hidden')
})

// Image lazy loading
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.2,
  rootMargin: '200px',
})

imgs.forEach(img => imgObserver.observe(img))

// Slider
const slide = () => {
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  const addDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  }
  addDots()

  // Active dot
  const activeDot = function (slide) {
    document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }

  const moveToSlide = function (sl) {
    slides.forEach((slide, i) => (slide.style.transform = `translateX(${100 * (i - sl )}%)`)) // placing slides next to each other
  }
  moveToSlide(0)

  // Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0
    } else {
      currentSlide++;
    }
    moveToSlide(currentSlide);
    activeDot(currentSlide)
  }
  btnRight.addEventListener('click', nextSlide)

  // Previous slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    moveToSlide(currentSlide);
    activeDot(currentSlide);
  }
  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function (e) {
    e.key === 'Arrowright' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const {
        slide
      } = e.target.dataset
      moveToSlide(slide)
      activeDot(slide)
    }
  })
}
slide();