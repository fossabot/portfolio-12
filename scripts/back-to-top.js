let f = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Elements
let backToTop = document.querySelector('.back-to-top');
let footer = document.querySelector('.footer');

// Hide back to top and add click listener
backToTop.classList.add('back-to-top--hidden');
backToTop.addEventListener('click', e => {
  e.preventDefault();

  let t = 0;
  let interval = setInterval(function() {
    t += 0.01;
    document.body.scrollTop -= document.body.scrollTop * f(t);
    if(document.body.scrollTop <= 0) clearInterval(interval);
  }, 10);
});

// Observe the footer to determine if .back-to-top should be shown
let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      backToTop.classList.remove('back-to-top--hidden');
    } else {
      backToTop.classList.add('back-to-top--hidden');
    }
  });
});
observer.observe(footer);
