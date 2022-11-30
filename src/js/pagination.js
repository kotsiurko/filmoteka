import { all } from 'axios';
import { MovieDB } from './api-service';
import { renderHTML } from './home-page-loading';

const movie = new MovieDB();

function pagination(currentPage, allPages) {
  let markup = '';
  let beforeTwoPage = currentPage - 2;
  let beforePage = currentPage - 1;
  let afterPage = currentPage + 1;
  let afterTwoPage = currentPage + 2;
  movie.page = currentPage;

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

function onPaginationClick(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }
  if (event.target.textContent === '...') {
    return;
  }
  if (event.target.textContent === '🡸') {
    movie.fetchData((movie.page -= 1)).then(data => {
      // renderHTML(data.results);
      pagination(data.page, data.total_pages);
    });
    return;
  }
  if (event.target.textContent === '🡺') {
    movie.fetchData((movie.page += 1)).then(data => {
      // renderHTML(data.results);
      pagination(data.page, data.total_pages);
    });
    return;
  }
  const page = event.target.textContent;
  movie.fetchData(movie.page).then(data => {
    // renderHTML(data.results);
    pagination(data.page, data.total_pages);
  });
}
