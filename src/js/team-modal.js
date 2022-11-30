const teamModalLinkEl = document.querySelector('.js-team-modal');
const teamModCloseEl = document.querySelector('[data-modal-team-close]')
const teamModalEl = document.querySelector("[data-modal-team]")
const backdrpTeamEl = document.querySelector('.backdrop-team')
  // слухач на батьківський UL карток
teamModalLinkEl.addEventListener('click', onModalOpenClick);

function onModalOpenClick(event) {
   event.preventDefault();
   teamModalEl.classList.remove("is-hidden");
   teamModCloseEl.addEventListener('click', onModalCloseClick);
   backdrpTeamEl.addEventListener('click', onBackdropElClick);
   window.addEventListener('keydown', onEscBtnClick);
}

function onModalCloseClick() {
  teamModalEl.classList.add("is-hidden");
  teamModCloseEl.removeEventListener("click", onModalCloseClick);
  backdrpTeamEl.removeEventListener('click', onBackdropElClick);
  window.removeEventListener('keydown', onEscBtnClick)
  }

 function onBackdropElClick(event) {
   if (event.target === backdrpTeamEl) {
     onModalCloseClick();
  }
 } 
 function onEscBtnClick(event) {
   if (event.code === 'Escape') {
     onModalCloseClick();
  }
 }