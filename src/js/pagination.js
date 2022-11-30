import { all } from 'axios';
import { MovieDB } from './api-service';
import { renderHTML } from './home-page-loading';

const movie = new MovieDB();
console.log(movie);
let globalCurrentPage = 1;

async function fetch() {
  const fetchResult = await movie.fetchTrendMovies(movie.page);
  let fetchCurrentPage = fetchResult.data.page;
  let fetchTotalPages = fetchResult.data.total_pages;
  console.log(fetchCurrentPage);
  console.log(fetchTotalPages);
  pagination(fetchCurrentPage, fetchTotalPages);
  const ourPages = { fetchCurrentPage, fetchTotalPages };
  return ourPages;
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
  // let data = await fetch();
  // console.log(data);
  if (event.target.nodeName !== 'LI') {
    return;
  }
  if (event.target.textContent === '...') {
    return;
  }
  if (event.target.textContent === '🡸') {
    fetch((globalCurrentPage -= 1)).then(data => {
      // renderHTML(data.results);
      pagination(data.fetchCurrentPage, data.fetchTotalPages);
    });
    return;
  }
  // if (event.target.textContent === '🡺') {
  //   fetch((globalCurrentPage += 1)).then(data => {
  //     // renderHTML(data.results);
  //     console.log(globalCurrentPage);
  //     pagination(data.fetchCurrentPage, data.fetchTotalPages);
  //   });
  //   return;
  // }

  if (event.target.textContent === '🡺') {
    fetch().then(data => {
      data.fetchCurrentPage += 1;

      // renderHTML(data.results);
      console.log(data);
      pagination(data.fetchCurrentPage, data.fetchTotalPages);
    });
    return;
  }

  const page = event.target.textContent;
  fetch(globalCurrentPage).then(data => {
    // renderHTML(data.results);
    pagination(data.fetchCurrentPage, data.fetchTotalPages);
  });
}
