import { loaderRender } from './preloader';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';

const cards = document.querySelector('.cards');
const emptyEl = document.querySelector('.empty');

const watchedFilmListBtnEl = document.getElementById('js-WatchedButton');
const queuedFilmListBtnEl = document.getElementById('js-QueueButton');
const WATCHED_STORAGE_KEY = "watched films";
const QUEUE_STORAGE_KEY = "films in queue"

loaderRender();



watchedFilmListBtnEl.addEventListener('click', onLSLoadWatched);
queuedFilmListBtnEl.addEventListener('click', onLSLoadQueue);



// Перевірка на наявність даних в ЛокалСторедж
// Якщо є дані, тоді рендерим картки
const LS_WWATCHED_ARRAY = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY));
if (LS_WWATCHED_ARRAY.length !== 0) {
    renderFilmCards(LS_WWATCHED_ARRAY);
}



// Функція витягує переглянуті фільми з ЛокалСторедж
function onLSLoadWatched() {
  watchedFilms = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY));
  console.log(watchedFilms);
  renderFilmCards(watchedFilms);
}

// Функція витягує фільми з черги з ЛокалСторедж
function onLSLoadQueue() {
    queuedFilms = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY))
    console.log(queuedFilms);
    renderFilmCards(queuedFilms);
}

// Функція, що підготовлює дані в картку для рендеру
function renderFilmCards(films) {
    const markup = films.map(film => {
        console.log(film);
        console.log(film.filmGenres);

        // Формую підготовлений об'єкт даних для закидання в handlebar
        const editedFilm = {
            ...film,
            poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            genres: film.filmGenres,
            release_date: film.release_date.slice(0, 4),
        };
        return editedFilm;
    });

    emptyEl.innerHTML = '';
    cards.innerHTML = cardTemplate(markup);
}

