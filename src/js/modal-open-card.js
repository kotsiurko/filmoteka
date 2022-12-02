import { MovieDB } from './api-service';
import { getMovieDetails } from './home-page-loading';
const modalOpenEl = document.querySelector('[data-modal-open]');
const modalCloseEl = document.querySelector('[data-modal-close]');
const modalEl = document.querySelector('[data-modal]');
const backdropEl = document.querySelector('.backdrop');
const modalContainerEl = document.querySelector('.tablet-container');
const body = document.querySelector('body');

const WATCHED_STORAGE_KEY = "watched films";
const QUEUE_STORAGE_KEY = "films in queue"

// слухач на батьківський UL карток
modalOpenEl.addEventListener('click', onModalOpenClick);

const movieDB = new MovieDB();

// Функція відкриття модалки
async function onModalOpenClick(event) {
  event.preventDefault();
  if (event.target.closest('li')) {
    modalEl.classList.remove('is-hidden');
    modalCloseEl.addEventListener('click', onModalCloseClick);
    backdropEl.addEventListener('click', onBackdropElClick);
    window.addEventListener('keydown', onEscBtnClick);

    const selectedMovie = event.target.closest('li');
    // console.log(selectedMovie);
    const FilmID = selectedMovie.dataset.movieid;
    // console.log(FilmID);



    try {
      const { data } = await movieDB.fetchMovieById(FilmID);
      // console.log(data);
      renderFilmCard(data);
      body.classList.add('noScroll');
      const watchedBtnEl = document.getElementById("watched");

      // зчитування інформації з дата-атрибуту кнопки
      const modalFilmIdEl = document.querySelector('[data-filmid]');
      const modalFilmId = modalFilmIdEl.dataset.filmid;

      // Перезапис атрибута кнопки значенням data-watched="false/true"
      // в залежності від того, чи є фільм в LS

      // Сценарій, коли якісь фільми вже є в ЛС
      if (localStorage.getItem('watched films') !== null) {

        // Пошук фільму в масиві збережених в ЛС
        const LS_WWATCHED_ARRAY = JSON.parse(localStorage.getItem("watched films"));
        // Витягуємо індекс фільму з масиву збережених в ЛокалСторедж
        let foundFilmIndex = LS_WWATCHED_ARRAY.findIndex(el => el.id === Number(modalFilmId));
        console.log(foundFilmIndex);

        // якщо фільму немає в ЛС
        if (foundFilmIndex === -1) {
          console.log("Film is NOT in LS");
          watchedBtnEl.dataset.watched = 'false';
          watchedBtnEl.textContent = 'add to Watche';
          watchedBtnEl.addEventListener('click', onBtnWatchedClick)
          return;
        }
        // якщо фільм є в ЛС
        if (foundFilmIndex + 1) {
          console.log("Film is in LS");
          watchedBtnEl.dataset.watched = 'true';
          watchedBtnEl.textContent = 'Remove from Watched';
          watchedBtnEl.addEventListener('click', onBtnWatchedClick)
          return;
        }
        return;
      }

      // Сценарій, коли ЛС повністю пустий
      if (localStorage.getItem('watched films') === null) {
        // Випадок, коли ЛС чистий і ми все одно можемо записати фільм в ЛС
        watchedBtnEl.dataset.watched = 'false';
        watchedBtnEl.addEventListener('click', onBtnWatchedClick)
        return;
      }





      // обробник події кліку по кнопці
      // перевірка по атрибуту data-watched="false"
      // з подальшим записом чи видаленням фільму з ЛС
      // та перемальовкою кнопки та її атрибута
      //


      // function onBtnClick() {
      //   console.log("Подія обробника кліку");
      //   // onBtnWatchedClick();
      //   // або так
      //   // onBtnWatchedClick;
      // }


      function onBtnWatchedClick() {
        // якщо data-watched="false", то
        if (watchedBtnEl.dataset.watched === 'false') {
          //	викликаю функцію запису об'єкта в ЛС;
          console.log("Тіпа додав фільм в ЛС");
          console.log(data);
          addFilmToLS(data);
          // Перемальовую кнопку
          watchedBtnEl.dataset.watched = 'true';
          watchedBtnEl.textContent = 'Remove from Watched';

          // ?? Можливо викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnWatchedClick;
          })
          return;
        }
        // якщо data-watched="true", то
        if (watchedBtnEl.dataset.watched === 'true') {
          //	викликаю функцію видалення об'єкта з ЛС:
          console.log("Тіпа видалив фільм з ЛС");
          console.log(modalFilmId);
          removeFilmFromLS(modalFilmId);
          // Перемальовую кнопку
          watchedBtnEl.dataset.watched = 'false';
          watchedBtnEl.textContent = 'Add to Watch';

          //?? Можливо викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnWatchedClick;
          })
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    alert('Please click on film image');
  }
  return;
}


function onModalCloseClick() {
  modalEl.classList.add('is-hidden');
  body.classList.remove('noScroll');
  modalCloseEl.removeEventListener('click', onModalCloseClick);
  backdropEl.removeEventListener('click', onBackdropElClick);
  window.removeEventListener('keydown', onEscBtnClick);
}







// // ======================================================
// // функція видалення фільму з ЛС
// // ======================================================
function removeFilmFromLS(filmId) {

  // filmId - текстова стрічка id фільму із АПІ
  console.log(filmId);
  const LS_WWATCHED_ARRAY = JSON.parse(localStorage.getItem("watched films"));
  let foundFilmIndex = LS_WWATCHED_ARRAY.findIndex(el => el.id === Number(filmId));
  // console.log(foundFilmIndex);

  // видалити знайдений фільм з цього масиву за індексом
  LS_WWATCHED_ARRAY.splice(foundFilmIndex, 1);
  console.log(LS_WWATCHED_ARRAY);
  // записати новий масив в ЛокалСторедж
  localStorage.setItem("watched films", JSON.stringify(LS_WWATCHED_ARRAY));

  console.log("Фільм видалений");
}
// // ======================================================


// // ======================================================
// // Функція додавання фільму в ЛС
// // ======================================================
function addFilmToLS(film) {
  console.log(film);
  localStrgWriteWatched(film);
  console.log("Фільм доданий");
}
// // ======================================================



















function onBackdropElClick(event) {
  if (event.target === backdropEl) {
    body.classList.remove('noScroll');
    onModalCloseClick();
  }
}

function onEscBtnClick(event) {
  if (event.code === 'Escape') {
    onModalCloseClick();
    body.classList.remove('noScroll');
  }
}


function prepareObject(array) {
  let newArr = array.map(el => el.name);
  let filmGenres = '';

  if (newArr.length < 4) {
    filmGenres = newArr.join(', ');
  }
  if (newArr.length >= 4) {
    filmGenres = newArr.slice(0, 2).join(', ') + ", Others";
  }
  return filmGenres;
}


function renderFilmCard(data) {
  const {
    poster_path,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    overview,
    id,
  } = data;

  let filmGenres = prepareObject(data.genres);


  const markup = `
  <div hidden data-filmid="${id}"></div>
      <img src="https://image.tmdb.org/t/p/w500${poster_path}" class="modal-image" alt="${title}" />
           <div class="description-container">
        <h2 class="film-heading">${title}</h2>
        <ul class="film-info__list">
          <li class="film-info__item">
            <p class="film-info__item--el">Vote / Votes</p>
            <span class="film-info__vote">${vote_average}</span>
            <span> &nbsp;/&nbsp;</span>
            <span class="film-info__params">${vote_count}</span>
          </li>
          <li class="film-info__item">
            <p class="film-info__item--el">Popularity</p>
            <span class="film-info__params">${popularity}</span>
          </li>
          <li class="film-info__item">
            <p class="film-info__item--el">Original Title</p>
            <span class="film-info__params">${original_title}</span>
          </li>
          <li class="film-info__item">
            <p class="film-info__item--el">Genre</p>
            <span class="film-info__params">${filmGenres}</span>
          </li>
        </ul>
        <h3 class="film-info__about">About</h3>
        <p class="film-info__description">
          ${overview}
        </p>
        <div class="btn-container">
        <button class="button button__orange" id="watched" data-watched="false">add to Watched</button>
        <button class="button button__transparent">add to queue</button>
      </div>
        </div>`;
  modalContainerEl.innerHTML = markup;
}


function localStrgWriteWatched(data) {
  console.log(data);

  filmGenres = prepareObject(data.genres);

  const watchedFilms = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY)) || [];
  const { poster_path, title, vote_average, vote_count, popularity, original_title, overview, release_date, id } = data;
  const filmData = {
    title: title,
    poster_path: poster_path,
    vote_average: vote_average,
    vote_count: vote_count,
    popularity: popularity,
    original_title: original_title,
    overview: overview,
    filmGenres: filmGenres,
    release_date: release_date,
    id: id,
  };
  watchedFilms.push(filmData);
  const stringifyData = JSON.stringify(watchedFilms);
  localStorage.setItem(WATCHED_STORAGE_KEY, stringifyData);
}

function localStrgWriteAddToQueue(data) {
  filmGenres = prepareObject(data.genres);
  const watchedFilms = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY)) || []
  const { poster_path, title, vote_average, vote_count, popularity, original_title, overview, release_date, id } = data;
  const filmData = {
    title: title,
    poster_path: poster_path,
    vote_average: vote_average,
    vote_count: vote_count,
    popularity: popularity,
    original_title: original_title,
    overview: overview,
    filmGenres: filmGenres,
    release_date: release_date,
    id: id,
  };

  watchedFilms.push(filmData);
  const stringifyData = JSON.stringify(watchedFilms);
  localStorage.setItem(QUEUE_STORAGE_KEY, stringifyData);
}


// function localStorageRemove(data) {
//   localStorage.removeItem(data)
// }

// function onModalOpenClick(event) {
//   event.preventDefault();
//   if (event.target.closest('li')) {
//     modalEl.classList.remove('is-hidden');
//     modalCloseEl.addEventListener('click', onModalCloseClick);
//     backdropEl.addEventListener('click', onBackdropElClick);
//     window.addEventListener('keydown', onEscBtnClick);
//   } else {
//     alert('Please click on film image');
//   }
//   return;
// }
// function onModalCloseClick() {
//   modalEl.classList.add('is-hidden');
//   modalCloseEl.removeEventListener('click', onModalCloseClick);
//   backdropEl.removeEventListener('click', onBackdropElClick);
//   window.removeEventListener('keydown', onEscBtnClick);
// }
// function onBackdropElClick(event) {
//   if (event.target === backdropEl) {
//     onModalCloseClick();
//   }
// }
// function onEscBtnClick(event) {
//   if (event.code === 'Escape') {
//     onModalCloseClick();
//   }
// }