const HIDE_SOCIAL_INTERSECTION_RATIO = 0.7;

// Elements
let navbarSocial = document.querySelector('.navbar-group-social');

// Observe the footer to determine if .navbar-group-social should be hidden
let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > HIDE_SOCIAL_INTERSECTION_RATIO) {
      navbarSocial.classList.add('navbar__group--hidden');
    } else {
      navbarSocial.classList.remove('navbar__group--hidden');
    }
  });
}, { threshold: [HIDE_SOCIAL_INTERSECTION_RATIO] });

document.addEventListener('DOMContentLoaded', () => {
  let footer = document.querySelector('.footer');
  observer.observe(footer);
});
