/* jshint browser: true */

const MINIMUM_TOP_OFFSET = 50;
const backToTop = document.querySelector('.back-to-top');

// Hide .back-to-top and add click listener
backToTop.classList.add('back-to-top--hidden');

// Move to top when .back-to-top is clicked
backToTop.addEventListener('click', e => {
  e.preventDefault();

  let f = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  let t = 0;
  let interval = setInterval(() => {
    t += 0.015;
    document.body.scrollTop -= document.body.scrollTop * f(t);
    if(document.body.scrollTop <= 0) clearInterval(interval);
  }, 10);
});

// Observe the footer to determine if .back-to-top should be shown
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && document.body.scrollTop > MINIMUM_TOP_OFFSET) {
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
