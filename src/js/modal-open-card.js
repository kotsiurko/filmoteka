import { MovieDB } from './api-service';
import { numberConverter } from './prepare-number';
// import { renderFilmCards } from './home-page-loading';
// console.dir(renderFilmCards);
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css'
// import { getMovieDetails } from './home-page-loading';
const modalOpenEl = document.querySelector('[data-modal-open]');
const modalCloseEl = document.querySelector('[data-modal-close]');
const modalEl = document.querySelector('[data-modal]');
const backdropEl = document.querySelector('.backdrop');
const modalContainerEl = document.querySelector('.tablet-container');
const body = document.querySelector('body');

const WATCHED_STORAGE_KEY = 'watched films';
const QUEUE_STORAGE_KEY = 'films in queue';

// слухач на батьківський UL карток
modalOpenEl.addEventListener('click', onModalOpenClick);

const movieDB = new MovieDB();

// ======================================================
// Функції-обробники закриття/відериття модального вікна
// ======================================================
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

function onModalCloseClick() {
  modalEl.classList.add('is-hidden');
  body.classList.remove('noScroll');
  modalCloseEl.removeEventListener('click', onModalCloseClick);
  backdropEl.removeEventListener('click', onBackdropElClick);
  window.removeEventListener('keydown', onEscBtnClick);
}

// Головна функція-обробник появи модального вікна
async function onModalOpenClick(event) {
  event.preventDefault();
  if (event.target.closest('li')) {
    modalEl.classList.remove('is-hidden');
    modalCloseEl.addEventListener('click', onModalCloseClick);
    backdropEl.addEventListener('click', onBackdropElClick);
    window.addEventListener('keydown', onEscBtnClick);

    const selectedMovie = event.target.closest('li');
    const FilmID = selectedMovie.dataset.movieid;

    try {
      const { data } = await movieDB.fetchMovieById(FilmID);
      renderFilmCard(data);
      body.classList.add('noScroll');
      const watchedBtnEl = document.getElementById('watched');
      const queuedBtnEl = document.getElementById('queued');

      // зчитування інформації з дата-атрибуту кнопки
      const modalFilmIdEl = document.querySelector('[data-filmid]');
      const modalFilmId = modalFilmIdEl.dataset.filmid;
      
      // слухач кнопки трейлера і колбек при кліку по ньому
       const trailerBtnEl = document.querySelector(".trailer-link");
       console.log(trailerBtnEl);
       trailerBtnEl.addEventListener('click', onTrailerClick);
      function onTrailerClick(e) {
        
        movieDB.getMovieTrailer(FilmID).then(data => {
          const trailerKey = data.data.results.find(el => el.name === 'Official Trailer').key;
          console.log(trailerKey);
          const instance = basicLightbox.create(`<iframe width="560" height="280" class= "iframe" src="https://www.youtube.com/embed/JaV7mmc9HGw" title="YouTube video player" frameborder="0" allowfullscreen></iframe>`);
          instance.show()
          //  modalContainerEl.insertAdjacentHTML('beforeend', 
          //    `<iframe width="280" height="240" src="https://www.youtube.com/embed/${trailerKey}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          //    `)
        }
          
        );
      }

      // ================================================
      // Блок роботи із Переглянутими фільмами та ЛС
      // ================================================
      // Далі йде логіка перезапису атрибута data-watched="false/true"
      // в залежності від того, чи є фільм в Переглянутих в LS

      // Сценарій, коли ЛС з Переглянутими повністю пустий
      if (localStorage.getItem('watched films') === null) {
        // Випадок, коли ЛС чистий і ми все одно можемо записати фільм в ЛС
        watchedBtnEl.dataset.watched = 'false';
        watchedBtnEl.addEventListener('click', onBtnWatchedClick);
      }

      // Сценарій, коли якісь фільми вже є в ЛС
      if (localStorage.getItem('watched films') !== null) {
        // Пошук фільму в масиві збережених в ЛС
        const LS_WWATCHED_ARRAY = JSON.parse(
          localStorage.getItem('watched films')
        );
        // Витягуємо індекс фільму з масиву збережених в ЛокалСторедж
        let foundFilmIndex = LS_WWATCHED_ARRAY.findIndex(
          el => el.id === Number(modalFilmId)
        );

        // якщо фільму немає в ЛС
        if (foundFilmIndex === -1) {
          watchedBtnEl.dataset.watched = 'false';
          watchedBtnEl.textContent = 'add to Watched';
          watchedBtnEl.addEventListener('click', onBtnWatchedClick);
        }
        // якщо фільм є в ЛС
        if (foundFilmIndex + 1) {
          watchedBtnEl.dataset.watched = 'true';
          watchedBtnEl.textContent = 'Remove from Watched';
          watchedBtnEl.addEventListener('click', onBtnWatchedClick);
        }
      }

      // обробник події кліку по кнопці
      // перевірка по атрибуту data-watched="false"
      // з подальшим записом чи видаленням фільму з ЛС
      // та перемальовкою кнопки та її атрибута
      function onBtnWatchedClick() {
        // якщо data-watched="false", то
        if (watchedBtnEl.dataset.watched === 'false') {
          //	викликаю функцію запису об'єкта в ЛС;
          addFilmToLS(data, 'watched films');

          // Перемальовую картки, коли змінюю ЛС
          // renderFilmCards(data);

          // Перемальовую кнопку
          watchedBtnEl.dataset.watched = 'true';
          watchedBtnEl.textContent = 'Remove from Watched';

          // Викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnWatchedClick;
          });
          return;
        }
        // якщо data-watched="true", то
        if (watchedBtnEl.dataset.watched === 'true') {
          //	викликаю функцію видалення об'єкта з ЛС:
          removeFilmFromLS(modalFilmId, 'watched films');

          // Перемальовую картки, кои змінюю ЛС
          // renderFilmCards(data);

          // Перемальовую кнопку
          watchedBtnEl.dataset.watched = 'false';
          watchedBtnEl.textContent = 'Add to Watch';

          // Викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnWatchedClick;
          });
          return;
        }
      }
      // ================================================

      // ================================================
      // Блок роботи із фільмами в Черзі та ЛС
      // ================================================
      // Далі йде логіка перезапису атрибута data-queued="false/true"
      // в залежності від того, чи є фільм в Черзі в LS

      // Сценарій, коли ЛС повністю пустий
      if (localStorage.getItem('films in queue') === null) {
        // Випадок, коли ЛС з Чергою чистий і ми все одно можемо записати фільм в ЛС
        queuedBtnEl.dataset.queued = 'false';
        queuedBtnEl.addEventListener('click', onBtnQueuedClick);
        return;
      }

      if (localStorage.getItem('films in queue') !== null) {
        // Пошук фільму в масиві збережених в ЛС
        const LS_ARRAY = JSON.parse(localStorage.getItem('films in queue'));
        // Витягуємо індекс фільму з масиву збережених в ЛокалСторедж
        let foundFilmIndex = LS_ARRAY.findIndex(
          el => el.id === Number(modalFilmId)
        );

        // якщо фільму немає в ЛС
        if (foundFilmIndex === -1) {
          queuedBtnEl.dataset.queued = 'false';
          queuedBtnEl.textContent = 'add to queue';
          queuedBtnEl.addEventListener('click', onBtnQueuedClick);
        }
        // якщо фільм є в ЛС
        if (foundFilmIndex + 1) {
          queuedBtnEl.dataset.queued = 'true';
          queuedBtnEl.textContent = 'Remove from Queue';
          queuedBtnEl.addEventListener('click', onBtnQueuedClick);
        }
      }

      function onBtnQueuedClick() {
        // якщо data-queued="false", то
        if (queuedBtnEl.dataset.queued === 'false') {
          //	викликаю функцію запису об'єкта в ЛС;
          addFilmToLS(data, 'films in queue');
          // Перемальовую кнопку
          queuedBtnEl.dataset.queued = 'true';
          queuedBtnEl.textContent = 'Remove from Queue';

          // Викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnQueuedClick;
          });
          return;
        }
        // якщо data-queued="true", то
        if (queuedBtnEl.dataset.queued === 'true') {
          //	викликаю функцію видалення об'єкта з ЛС:
          removeFilmFromLS(modalFilmId, 'films in queue');
          // Перемальовую кнопку
          queuedBtnEl.dataset.queued = 'false';
          queuedBtnEl.textContent = 'Add to Queue';

          // Викликаю колбек-функцію, яка викликає сама-себе
          modalFilmIdEl.addEventListener('click', () => {
            onBtnQueuedClick;
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  // else {
  //   alert('Please click on film image');
  // }
  return;
}
// ======================================================

function prepareObject(array) {
  let newArr = array.map(el => el.name);
  let filmGenres = '';

  if (newArr.length < 4) {
    filmGenres = newArr.join(', ');
  }
  if (newArr.length >= 4) {
    filmGenres = newArr.slice(0, 2).join(', ') + ', Other';
  }
  return filmGenres;
}

function renderFilmCard(data) {
  let posterPath = '';
  const defaultImg =
    'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg';

  if (data.poster_path !== null) {
    posterPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  } else {
    posterPath = defaultImg;
  }
  const {
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    overview,
    id,
    genres,
  } = data;
  console.log(vote_average);
  console.log(data);

  let filmGenres = prepareObject(genres);
  let filmVotingAverage = numberConverter(vote_average);
  let cuttedPopularity = numberConverter(popularity);

  const markup = `
  <div hidden data-filmid="${id}"></div>
      <img src="${posterPath}" class="modal-image" alt="${title}" />
           <div class="description-containegit branch r">
        <h2 class="film-heading">${title}</h2>
        <ul class="film-info__list">
          <li class="film-info__item">
            <p class="film-info__item--el">Vote / Votes</p>
            <span class="film-info__vote">${filmVotingAverage}</span>
            <span> &nbsp;/&nbsp;</span>
            <span class="film-info__params">${vote_count}</span>
          </li>
          <li class="film-info__item">
            <p class="film-info__item--el">Popularity</p>
            <span class="film-info__params">${cuttedPopularity}</span>
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
        <button class="button button__transparent" id="queued" data-queued="false">add to queue</button>
      </div>
      <button class="trailer-link">
      watch trailer</button>
        </div>`;
  
  modalContainerEl.innerHTML = markup;
}

// ======================================================================
// УНІВЕРСАЛЬНА Функція ДОДАВАННЯ ФІЛЬМУ
// в Переглянуті / Чергу в ЛС
// data - текстова стрічка id фільму із АПІ
// key - ключ ("watched films" / "films in queue")
// ======================================================================
function addFilmToLS(data, key) {
  let filmGenres = prepareObject(data.genres);
  const filmsArray = JSON.parse(localStorage.getItem(key)) || [];
  const {
    poster_path,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    overview,
    release_date,
    id,
  } = data;
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

  filmsArray.push(filmData);
  const stringifyData = JSON.stringify(filmsArray);
  localStorage.setItem(key, stringifyData);
}
// // ======================================================

// // ======================================================
// Універсальна функція ВИДАЛЕННЯ ФІЛЬМУ (filmId)
// з Переглянути чи черги із ЛС
// filmId - текстова стрічка id фільму із АПІ
// key - ключ ("watched films" / "films in queue")
// // ======================================================
function removeFilmFromLS(filmId, key) {
  const LS_ARRAY = JSON.parse(localStorage.getItem(key));
  let foundFilmIndex = LS_ARRAY.findIndex(el => el.id === Number(filmId));

  // видалити знайдений фільм з цього масиву за індексом
  LS_ARRAY.splice(foundFilmIndex, 1);
  // записати новий масив в ЛокалСторедж
  localStorage.setItem(key, JSON.stringify(LS_ARRAY));
}
// // ======================================================
