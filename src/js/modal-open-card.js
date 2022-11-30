
const modalOpenEl = document.querySelector('[data-modal-open]');
const modalCloseEl = document.querySelector('[data-modal-close]')
const modalEl = document.querySelector("[data-modal]")
const backdropEl = document.querySelector('.backdrop')
  // слухач на батьківський UL карток
modalOpenEl.addEventListener('click', onModalOpenClick);

function onModalOpenClick(event) {
  event.preventDefault();
  if (event.target.closest('li')) {
   modalEl.classList.remove("is-hidden");
   modalCloseEl.addEventListener('click', onModalCloseClick);
   backdropEl.addEventListener('click', onBackdropElClick);
   window.addEventListener('keydown', onEscBtnClick);
  } else {
    alert('Please click on film image');
  }
  return
}

function onModalCloseClick() {
  modalEl.classList.add("is-hidden");
  modalCloseEl.removeEventListener("click", onModalCloseClick);
  backdropEl.removeEventListener('click', onBackdropElClick);
  window.removeEventListener('keydown', onEscBtnClick)
  }

 function onBackdropElClick(event) {
   if (event.target === backdropEl) {
     onModalCloseClick();
  }
 } 
 function onEscBtnClick(event) {
   if (event.code === 'Escape') {
     onModalCloseClick();
  }
 }








