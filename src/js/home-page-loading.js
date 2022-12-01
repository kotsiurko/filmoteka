import { MovieDB } from './api-service';
import cardTemplate from '../templates/film-card.hbs';
import genres from './genres.json';
import { renderWarningMsg } from './test-warning';
// console.log(renderWarningMsg);

const cards = document.querySelector('.cards');
const searchFormEl = document.querySelector('#search-form');

const movieDB = new MovieDB();

onHomePageLoad();
searchFormEl.addEventListener('submit', onSearchFormSubmit);

// let totalPages = null;

// =============================================================================
// виклик функції по вимальовуванні детальної інформації в модалці має вигляд:
// getMovieDetails('774752');
// =============================================================================
export async function getMovieDetails(id) {
  try {
    const { data } = await movieDB.fetchMovieById(id);
    // =============================================
    // Тут має бути відкриття модалки
    // і передавання в неї даних із об'єкту data
    // id витягуємо із дата-атрибуту li-елемента
    // =============================================
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
getMovieDetails('774752');
// =============================================================================

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
    const { data } = await movieDB.fetchTrendMovies();
    renderFilmCards(data.results);
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
}

function renderFilmCards(films) {
  const markup = films.map(film => {
    // console.log(film);

    // Повертаю масив текстових жанрів до конкретного фільму
    // console.log('film: ', film);
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

    // Формую підготовлений об'єкт даних для закидання в handlebar
    const editedFilm = {
      ...film,
      poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
      genres: genreStr,
      release_date: film.release_date.slice(0, 4),
    };
    return editedFilm;
  });
  // console.log(markup);
  cards.innerHTML = cardTemplate(markup);
}
