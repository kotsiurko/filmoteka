export function loaderRender() {
  setTimeout(function () {
    const preloader = document.getElementById('preloader');
    if (!preloader.classList.contains('done')) {
      preloader.classList.add('done');
    }
  }, 200);
}