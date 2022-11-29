const backToTop = document.querySelector('.back_to_top');

window.addEventListener('scroll', trackScroll);
backToTop.addEventListener('click', backToTop);

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

function onTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -30);
    setTimeout(onTop, 0);
  }
}

// const topBtn = document.querySelector('.back_to_top');

// function scrollFunction() {
//   if (
//     document.body.scrollTop > 100 ||
//     document.documentElement.scrollTop > 100
//   ) {
//     topBtn.classList.add('back_to_top-show');
//   } else {
//     topBtn.classList.remove('back_to_top-show');
//   }
// }
