import { MovieDB } from './api-service';
import cardTemplate from '../templates/film-card-home.hbs';
import genres from './genres.json';
import { loaderRender } from './preloader';
import { numberConverter } from './prepare-number';
import defaultPhoto from '../images/default-photo.jpeg';

const cardsEl = document.querySelector('.cards');
const searchFormEl = document.querySelector('#search-form');
const searchFieldEl = document.querySelector('.search-field');
const warningField = document.querySelector('.js-warning');
const searchResField = document.querySelector('.js-search-results');
let globalCurrentPage = 1;
const searchAttr = 'searched';
const trendsAttr = 'trends';

const movieDB = new MovieDB();

onHomePageLoad();
searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(event, globalCurrentPage) {
  event.preventDefault();
  cardsEl.dataset.position = searchAttr;

  const inputSearchEl = event.target.elements.query.value.trim();
  if (inputSearchEl.length === 0) {
    searchResField.textContent = 'Please enter your request';
    setTimeout(() => {
      searchResField.textContent = '';
    }, 3000);

    event.currentTarget.reset();
    return;
  }

  movieDB.searchQuery = event.target.elements.query.value;

  anotherFetchSearch(globalCurrentPage);
}

async function anotherFetchSearch(globalCurrentPage) {
  try {
    const { data } = await movieDB.fetchSearch(globalCurrentPage);

    let fetchCurrentPage = data.page;
    let fetchTotalPages = data.total_pages;
    paginationMarkup(fetchCurrentPage, fetchTotalPages);

    searchFieldEl.value = '';
    if (data.results.length === 0) {
      warningField.textContent =
        'Search result not successful. Enter the correct movie name and try again';
      setTimeout(() => {
        warningField.textContent = '';
      }, 3000);

      return;
    }
    renderFilmCards(data.results);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function onHomePageLoad() {
  cardsEl.dataset.position = trendsAttr;

  try {
    const { data } = await movieDB.fetchTrendMovies(globalCurrentPage);

    let fetchCurrentPage = data.page;
    let fetchTotalPages = data.total_pages;
    paginationMarkup(fetchCurrentPage, fetchTotalPages);

    if (data) {
      loaderRender();
    }
    renderFilmCards(data.results);
    return data;
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

    if (newGenres.length < 4) {
      genreStr = newGenres.join(', ');
    }
    if (newGenres.length >= 4) {
      genreStr = newGenres.slice(0, 2).join(', ') + ', Other';
    }

    if (film.genre_ids.length === 0) {
      genreStr = 'Other';
    }

    let posterPath = '';
    const defaultImg = defaultPhoto;

    if (film.poster_path !== null) {
      posterPath = `https://image.tmdb.org/t/p/w500${film.poster_path}`;
    } else {
      posterPath = defaultImg;
    }

    const rating = numberConverter(film.vote_average);

    // Формую підготовлений об'єкт даних для закидання в handlebar
    const editedFilm = {
      ...film,
      poster_path: posterPath,
      genres: genreStr,
      release_date: film.release_date.slice(0, 4),
      vote_average: rating,
    };
    return editedFilm;
  });
  cardsEl.innerHTML = cardTemplate(markup);
}

// Добираємся до пагінації результатів пошуку
export function paginationMarkup(currentPage, allPages) {
  let markup = '';
  let beforeTwoPage = currentPage - 2;
  let beforePage = currentPage - 1;
  let afterPage = currentPage + 1;
  let afterTwoPage = currentPage + 2;
  globalCurrentPage = currentPage;

  if (currentPage > 1) {
    markup += `<li class="pagination__item slider-arrow prev">&#129144</li>`;
    markup += `<li class="pagination__item">1</li>`;
  }
  if (currentPage > 4) {
    markup += `<li class="pagination__item dots">...</li>`;
  }
  if (currentPage > 3) {
    markup += `<li class="pagination__item">${beforeTwoPage}</li>`;
  }
  if (currentPage > 2) {
    markup += `<li class="pagination__item">${beforePage}</li>`;
  }
  markup += `<li class="pagination__item pagination__item--current">${currentPage}</li>`;

  if (allPages - 1 > currentPage) {
    markup += `<li class="pagination__item">${afterPage}</li>`;
  }
  if (allPages - 2 > currentPage) {
    markup += `<li class="pagination__item">${afterTwoPage}</li>`;
  }
  if (allPages - 3 > currentPage) {
    markup += `<li class="pagination__item dots">...</li>`;
  }
  if (allPages > currentPage) {
    markup += `<li class="pagination__item">${allPages}</li>`;
    markup += `<li class="pagination__item slider-arrow next">&#129146</li>`;
  }
  paginationBox.innerHTML = markup;
}

const paginationBox = document.querySelector('.pagination__list');
paginationBox.addEventListener('click', onPaginationHomeClick);

async function onPaginationHomeClick(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }
  if (event.target.textContent === '...') {
    return;
  }
  if (event.target.textContent === '🡸') {
    window.scrollTo(0, 0);
    if (cardsEl.dataset.position === trendsAttr) {
      onHomePageLoad((globalCurrentPage -= 1)).then(data => {
        renderFilmCards(data.results);
        paginationMarkup(data.page, data.total_pages);
      });
      return;
    }
    if (cardsEl.dataset.position === searchAttr) {
      anotherFetchSearch((globalCurrentPage -= 1)).then(data => {
        renderFilmCards(data.results);
        paginationMarkup(data.page, data.total_pages);
      });
      return;
    }
  }
  if (event.target.textContent === '🡺') {
    window.scrollTo(0, 0);
    if (cardsEl.dataset.position === trendsAttr) {
      onHomePageLoad((globalCurrentPage += 1)).then(data => {
        renderFilmCards(data.results);
        paginationMarkup(data.page, data.total_pages);
      });
      return;
    }
    if (cardsEl.dataset.position === searchAttr) {
      anotherFetchSearch((globalCurrentPage += 1)).then(data => {
        renderFilmCards(data.results);
        paginationMarkup(data.page, data.total_pages);
      });
      return;
    }
  }

  const page = Number(event.target.textContent);
  globalCurrentPage = page;
  window.scrollTo(0, 0);

  if (cardsEl.dataset.position === trendsAttr) {
    onHomePageLoad(globalCurrentPage).then(data => {
      renderFilmCards(data.results);
      paginationMarkup(data.page, data.total_pages);
    });
    return;
  }
  if (cardsEl.dataset.position === searchAttr) {
    anotherFetchSearch(globalCurrentPage).then(data => {
      renderFilmCards(data.results);
      paginationMarkup(data.page, data.total_pages);
    });
    return;
  }
}
