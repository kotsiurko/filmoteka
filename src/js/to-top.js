const backToTop = document.querySelector('.back_to_top');

window.addEventListener('scroll', trackScroll);
backToTop.addEventListener('click', goToTop);

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    backToTop.classList.add('back_to_top-show');
  }
  if (scrolled < coords) {
    backToTop.classList.remove('back_to_top-show');
  }
}

function goToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
