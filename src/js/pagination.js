// import { all } from 'axios';
import { MovieDB } from './api-service';
import { renderFilmCards } from './home-page-loading';

const movie = new MovieDB();
let globalCurrentPage = 1;

async function fetch() {
  const fetchResult = await movie.fetchTrendMovies(globalCurrentPage);
  let fetchCurrentPage = fetchResult.data.page;
  let fetchTotalPages = fetchResult.data.total_pages;
  pagination(fetchCurrentPage, fetchTotalPages);
  // const ourPages = { fetchCurrentPage, fetchTotalPages };
  return fetchResult.data;
}

fetch();

function pagination(currentPage, allPages) {
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

paginationBox.addEventListener('click', onPaginationClick);

pagination();

async function onPaginationClick(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }
  if (event.target.textContent === '...') {
    return;
  }
  if (event.target.textContent === '🡸') {
    fetch((globalCurrentPage -= 1)).then(data => {
      renderFilmCards(data.results);
      pagination(data.page, data.total_pages);
    });
    return;
  }
  if (event.target.textContent === '🡺') {
    fetch((globalCurrentPage += 1)).then(data => {
      renderFilmCards(data.results);
      pagination(data.page, data.total_pages);
    });
    return;
  }

  const page = Number(event.target.textContent);
  console.log(typeof page, page);
  globalCurrentPage = page;
  fetch(globalCurrentPage).then(data => {
    console.log(data);
    renderFilmCards(data.results);
    pagination(data.page, data.total_pages);
  });
}
