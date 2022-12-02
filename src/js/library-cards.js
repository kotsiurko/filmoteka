import { loaderRender } from './preloader';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';

const cards = document.querySelector('.cards');
const emptyEl = document.querySelector('.empty');

// const modalOpenEl = document.querySelector('[data-modal-open]');
const modalOpenEl = document.querySelector('.cards');
const modalCloseEl = document.querySelector('[data-modal-close]');
const modalEl = document.querySelector('[data-modal]');
const backdropEl = document.querySelector('.backdrop');

const watchedFilmListBtnEl = document.getElementById('js-WatchedButton');
const queuedFilmListBtnEl = document.getElementById('js-QueueButton');
const WATCHED_STORAGE_KEY = "watched films";
const QUEUE_STORAGE_KEY = "films in queue"

loaderRender();

watchedFilmListBtnEl.addEventListener('click', onLSLoadWatched);
queuedFilmListBtnEl.addEventListener('click', onLSLoadQueue);

// слухач на батьківський UL карток
modalOpenEl.addEventListener('click', onModalOpenClick);





// Перевірка на наявність даних в ЛокалСторедж
// Якщо є дані, тоді рендерим картки
const LS_WWATCHED_ARRAY = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY));
if (LS_WWATCHED_ARRAY.length !== 0) {
    renderFilmCards(LS_WWATCHED_ARRAY);
}



// Функція витягує переглянуті фільми з ЛокалСторедж
function onLSLoadWatched() {
    watchedFilms = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY))
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
        // console.log(film);
        // console.log(film.filmGenres);

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


// Функція відкриття модалки
async function onModalOpenClick(event) {
    event.preventDefault();
    if (event.target.closest('li')) {
        modalEl.classList.remove('is-hidden');
        modalCloseEl.addEventListener('click', onModalCloseClick);
        backdropEl.addEventListener('click', onBackdropElClick);
        window.addEventListener('keydown', onEscBtnClick);
        console.log("I clicked on card");
    }
}


function onModalCloseClick() {
    modalEl.classList.add('is-hidden');
    modalCloseEl.removeEventListener('click', onModalCloseClick);
    backdropEl.removeEventListener('click', onBackdropElClick);
    window.removeEventListener('keydown', onEscBtnClick);
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