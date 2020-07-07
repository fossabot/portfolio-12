/* jshint browser: true */

let f = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Elements
let documentElement = document.documentElement;
let backToTop = document.querySelector('.back-to-top');

// Hide back to top and add click listener
backToTop.classList.add('back-to-top--hidden');
backToTop.addEventListener('click', e => {
  e.preventDefault();

  let t = 0;
  let interval = setInterval(function() {
    t += 0.015;
    documentElement.scrollTop -= documentElement.scrollTop * f(t);
    if(documentElement.scrollTop <= 0) clearInterval(interval);
  }, 10);
});

// Observe the footer to determine if .back-to-top should be shown
let observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && documentElement.scrollTop > 50) {
      backToTop.classList.remove('back-to-top--hidden');
    } else {
      backToTop.classList.add('back-to-top--hidden');
    }
  });
}, { threshold: [0] });

root.onDOMContentLoaded(() => {
  let footer = document.querySelector('.footer');
  observer.observe(footer);
});
