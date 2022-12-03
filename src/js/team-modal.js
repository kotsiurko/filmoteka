const teamModalLinkEl = document.querySelector('.js-team-modal');
const teamModCloseEl = document.querySelector('[data-modal-team-close]');
const teamModalEl = document.querySelector('[data-modal-team]');
const backdrpTeamEl = document.querySelector('.backdrop-team');
const body = document.querySelector('body');
// слухач на батьківський UL карток
teamModalLinkEl.addEventListener('click', onModalOpenClick);

function onModalOpenClick(event) {
  event.preventDefault();
  body.classList.add('noScroll');
  teamModalEl.classList.remove('is-hidden');
  teamModCloseEl.addEventListener('click', onModalCloseClick);
  backdrpTeamEl.addEventListener('click', onBackdropElClick);
  window.addEventListener('keydown', onEscBtnClick);
}

function onModalCloseClick() {
  teamModalEl.classList.add('is-hidden');
  body.classList.remove('noScroll');
  teamModCloseEl.removeEventListener('click', onModalCloseClick);
  backdrpTeamEl.removeEventListener('click', onBackdropElClick);
  window.removeEventListener('keydown', onEscBtnClick);
}

function onBackdropElClick(event) {
  if (event.target === backdrpTeamEl) {
    body.classList.remove('noScroll');
    onModalCloseClick();
  }
}
function onEscBtnClick(event) {
  if (event.code === 'Escape') {
    body.classList.remove('noScroll');
    onModalCloseClick();
  }
}
