import { loaderRender } from './preloader';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';

const cards = document.querySelector('.cards');

loaderRender();


const watchedBtnEl = document.getElementById('js-WatchedButton');
const WATCHED_STORAGE_KEY = "watched films";
// const QUEUE_STORAGE_KEY = "films in queue"

watchedBtnEl.addEventListener('click', onLSLoadWatched);

// Функція витягує дані з ЛокалСторедж
function onLSLoadWatched() {
    watchedFilms = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY))
    console.log(watchedFilms);
    renderFilmCards(watchedFilms);
}

// Функція, що підготовлює дані в картку для рендеру
function renderFilmCards(films) {
    const markup = films.map(film => {
        console.log(film);
        console.log(film.genre_ids);

        // Формую підготовлений об'єкт даних для закидання в handlebar
        const editedFilm = {
            ...film,
            poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            genres: filmGenres,
            release_date: film.release_date.slice(0, 4),
        };
        return editedFilm;
    });
    cards.innerHTML = cardTemplate(markup);
}