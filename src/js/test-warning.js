const searchForm = document.querySelector('#search-form');
const warningField = document.querySelector('.js-warning');
const searchResField = document.querySelector('.js-search-results');

searchForm.addEventListener('submit', onKeyWordSearch);

function onKeyWordSearch(event) {
    
    event.preventDefault();
    console.log(event.currentTarget.elements.query.value);
    if (event.currentTarget.elements.query.value === '') {
      searchResField.textContent = '';
      warningField.textContent = `Search result not successful. Enter the correct movie name and try again`;
      return;
    }
}


