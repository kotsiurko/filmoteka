import { MovieDB } from './api-service';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';
import { renderWarningMsg } from './test-warning';
import { loaderRender } from './preloader';
import { numberConverter } from './prepare-number';

const cards = document.querySelector('.cards');
const searchFormEl = document.querySelector('#search-form');

const movieDB = new MovieDB();

onHomePageLoad();
searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  // movieDB.page = 1;
  movieDB.searchQuery = event.target.elements.query.value;
  if (movieDB.searchQuery.length === 0) {
    renderWarningMsg();
    return;
  }

  try {
    const { data } = await movieDB.fetchSearch();
    console.log(data.results);
    renderFilmCards(data.results);
  } catch (err) {
    console.log(err);
  }
}

async function onHomePageLoad() {
  try {
    const { data } = await movieDB.fetchTrendMovies(1);
    if (data) {
      loaderRender();
    }
    renderFilmCards(data.results);
  } catch (err) {
    console.log(err);
  }
}

export function renderFilmCards(films) {
  const markup = films.map(film => {

    // Повертаю масив текстових жанрів до конкретного фільму
    const newGenres = film.genre_ids.map(id => {
      return genres.genres
        .map(jsonID => {
          if (jsonID.id === id) {
            return jsonID.name;
          }
        })
        .join('');
    });

    // Формую стрічку із жанрами для відображення в картці
    let genreStr = '';

    if (newGenres.length >= 3) {
      const strBegin = newGenres.slice(0, 2).join(', ');
      genreStr = strBegin + ', Other';
    } else {
      genreStr = newGenres.join(', ');
    }

    const rating = numberConverter(film.vote_average);
    // console.log(rating);

    // Формую підготовлений об'єкт даних для закидання в handlebar
    const editedFilm = {
      ...film,
      poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
      genres: genreStr,
      release_date: film.release_date.slice(0, 4),
      vote_average: rating,
    };
    return editedFilm;
  });
  cards.innerHTML = cardTemplate(markup);
}
