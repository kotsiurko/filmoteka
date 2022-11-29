import { MovieDB } from './api-service';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';

const cards = document.querySelector('.cards');

const movieDB = new MovieDB();

const Handlebars = require('handlebars');



async function onHomePageLoad() {

    movieDB.page = 1;
    try {
        const { data } = await movieDB.fetchData();

        // if (data.total === 0) {
        //     console.log('Sorry, there are no images matching your search query. Please try again.');
        //     return;
        // }

        // Page counter
        // totalPages = Math.ceil(data.total / data.hits.length);

        // console.log(data.results);
        renderHTML(data.results);

        // observer.observe(targetElement);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

onHomePageLoad();


function renderHTML(films) {
    const markup = films
        .map(film => {

            const newGenres = film.genre_ids.map(id => {
                return genres.genres.map(jsonID => {
                    if (jsonID.id === id) {
                        return jsonID.name
                    }
                }).join('');
            });

            let genreStr = '';

            if (newGenres.length >= 3) {
                const strBegin = newGenres.slice(0, 2).join(', ');
                genreStr = strBegin + ', Other';
            } else {
                genreStr = newGenres.join(', ');
            }

            const editedFilm = {
                ...film,
                poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                genres: genreStr,
                release_date: film.release_date.slice(0, 4),
            }
            return cardTemplate({ editedFilm });
        })
        .join('');
    cards.innerHTML = markup;
}

