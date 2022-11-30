const homeListFilmCard = document.querySelector('.home__list');

homeListFilmCard.addEventListener('click', ocClickOpenModal);

function ocClickOpenModal(event) {
  event.preventDefault();

  const closeBtn = document.querySelector('.modal-close-btn');
  closeBtn.addEventListener('click', onClickCloseModal);

  window.addEventListener('keydown', closeModalHandler);

  function closeModalHandler(event) {
    if (event.code === 'Escape') {
      modal.close();
      window.removeEventListener('keydown', closeModalHandler);
    }
  }

  function onClickCloseModal(event) {
    modal.close();
    window.removeEventListener('keydown', closeModalHandler);
  }
}




