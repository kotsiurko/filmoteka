import { MovieDB } from './api-service';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';

const cards = document.querySelector('.cards');
const searchFormEl = document.querySelector('#search-form');

const movieDB = new MovieDB();

onHomePageLoad();
searchFormEl.addEventListener('submit', onSearchFormSubmit);


// let totalPages = null;

async function onSearchFormSubmit(event) {
    event.preventDefault();

    // movieDB.page = 1;
    movieDB.searchQuery = event.target.elements.query.value;

    try {
        const { data } = await movieDB.fetchSearch();
        console.log(data.results);

        // if (data.results === 0) {
        //     console.log('Sorry, there are no images matching your search query. Please try again.');
        //     return;
        // }

        renderSearchQuery(data.results);
    } catch (err) {
        console.log(err);
    }
}





async function onHomePageLoad() {
    try {
        const { data } = await movieDB.fetchData();
        renderTrends(data.results);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}


function renderTrends(films) {
    const markup = films
        .map(film => {
            // console.log(film);

            // Повертаю масив текстових жанрів до конкретного фільму
            // console.log('film: ', film);
            const newGenres = film.genre_ids.map(id => {
                return genres.genres.map(jsonID => {
                    if (jsonID.id === id) {
                        return jsonID.name
                    }
                }).join('');
            });

            // Формую стрічку із жанрами для відображення в картці
            let genreStr = '';

            if (newGenres.length >= 3) {
                const strBegin = newGenres.slice(0, 2).join(', ');
                genreStr = strBegin + ', Other';
            } else {
                genreStr = newGenres.join(', ');
            }

            // Формую підготовлений об'єкт даних для закидання в handlebar
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

function renderSearchQuery(films) {
    const markup = films
        .map(film => {
            // console.log(film);

            // Повертаю масив текстових жанрів до конкретного фільму
            // console.log('film: ', film);
            // const newGenres = film.genre_ids.map(id => {
            //     return genres.genres.map(jsonID => {
            //         if (jsonID.id === id) {
            //             return jsonID.name
            //         }
            //     }).join('');
            // });

            // Формую стрічку із жанрами для відображення в картці
            // let genreStr = '';

            // if (newGenres.length >= 3) {
            //     const strBegin = newGenres.slice(0, 2).join(', ');
            //     genreStr = strBegin + ', Other';
            // } else {
            //     genreStr = newGenres.join(', ');
            // }

            // Формую підготовлений об'єкт даних для закидання в handlebar
            // const editedFilm = {
            //     ...film,
            //     poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            //     // genres: genreStr,
            //     release_date: film.release_date.slice(0, 4),
            // }
            return cardTemplate({ film });
        })
        .join('');
    cards.innerHTML = markup;
}