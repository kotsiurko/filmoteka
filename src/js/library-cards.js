import { loaderRender } from './preloader';
import cardTemplate from '../templates/film-card.hbs';
import { numberConverter } from './prepare-number';
import searchMan from '../images/emptyLibrary.png';

const paginationBox = document.querySelector('.pagination__list');
const cards = document.querySelector('.cards');
const emptyEl = document.querySelector('.empty');
const modalOpenEl = document.querySelector('.cards');
const modalCloseEl = document.querySelector('[data-modal-close]');
const modalEl = document.querySelector('[data-modal]');
const backdropEl = document.querySelector('.backdrop');
const watchedFilmListBtnEl = document.getElementById('js-WatchedButton');
const queuedFilmListBtnEl = document.getElementById('js-QueueButton');
const WATCHED_STORAGE_KEY = 'watched films';
const QUEUE_STORAGE_KEY = 'films in queue';
const watchedAttr = 'watched';
const queuedAttr = 'queued';
let globalCurrentPage = 1;
let renderFilmCardPage = null;
const cardsPerPage = 5;

loaderRender();

watchedFilmListBtnEl.addEventListener('click', onLSLoadWatched);
queuedFilmListBtnEl.addEventListener('click', onLSLoadQueue);

// слухач на батьківський UL карток
modalOpenEl.addEventListener('click', onModalOpenClick);

// ================================================
// Початкова ініціалізація сторінки
onLSLoadWatched(WATCHED_STORAGE_KEY);
// ================================================



// ================================================
// Функція зчитування даних з ЛС
// повертає масив об'єктів або null
function readFromLS(key) {
    let filmsArray = JSON.parse(localStorage.getItem(key));
    // перевірка на наявність масиву в ЛС
    if (filmsArray === null) {
        return;
    }
    return filmsArray;
}
// ================================================



// ===========================================================
// Функції-обробники перемикача в хедері
// Функція-обробник кліку перемикача QUEUE
function onLSLoadWatched() {
    // перевірка на наявність масиву в ЛС
    let filmsArray = JSON.parse(localStorage.getItem(WATCHED_STORAGE_KEY));
    if (filmsArray === null) {
        return;
    }

    contentRender(WATCHED_STORAGE_KEY, watchedAttr, 1);
}

// Функція-обробник кліку перемикача WATCHED
function onLSLoadQueue() {
    // перевірка на наявність масиву в ЛС
    let filmsArray = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY));
    if (filmsArray === null) {
        return;
    }
    contentRender(QUEUE_STORAGE_KEY, queuedAttr, 1);
}
// ===========================================================



// ===========================================================
// Універсальна функція вимальовки всього контенту на стоірнці
function contentRender(storageKey, attrib, currPage) {
    // витягує масив фільмів з ЛС
    const filmArr = readFromLS(storageKey);

    // перевірка на наявність масиву в ЛС
    if (filmArr === null) {
        return;
    }

    // змінює дата-атрибут
    cards.dataset.position = attrib;
    // Додаєм атрибут поточної позиції пагінації
    cards.dataset.page = currPage;

    // Визначаю кількість сторінок
    let allPages = splitArrayOnSubarrays(filmArr).length;

    // Обрізка масиву на порції
    // При цьому треба пам'ятати, що нумерація порції даних
    // (тобто масива в масиві) починається з 0
    renderFilmCardPage = currPage - 1;
    let arrPortion = splitArrayOnSubarrays(filmArr)[renderFilmCardPage];

    // Перевірка підмасиву на те, чи він не пустий
    if (arrPortion === 'undefined') {
        return;
    }

    // рендерить масив фільмів
    renderFilmCards(arrPortion);

    // рендерить пагінацію
    paginationMarkupRender(currPage, allPages);
}
// ===========================================================



// ===========================================================
/**
 * 
 * @param {array} films - portion of films to render on page
 * @returns nothing
 * it creates markup with films on page and
 * using handlebar 'cardTemplate'
 * render content
 */
function renderFilmCards(films) {
    if (films === undefined) {
        return;
    }

    const markup = films.map(film => {
        const rating = numberConverter(film.vote_average);

        // Формую підготовлений об'єкт даних для закидання в handlebar
        const editedFilm = {
            ...film,
            poster_path: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            genres: film.filmGenres,
            release_date: film.release_date.slice(0, 4),
            vote_average: rating,
        };
        return editedFilm;
    });

    emptyEl.innerHTML = '';
    cards.innerHTML = cardTemplate(markup);
}
// ===========================================================



// ===========================================================
/**
 * @param {array} array - array of film objects that are located in localStorage
 * @returns - array of arrays - array with splited subarray according to 'cardsPerPage'
 * [[], [], []] 
 * length of this big array - is the amount of pages
 */
function splitArrayOnSubarrays(array) {
    const splitedArray = array
        .map(function (el, ind) {
            return ind % cardsPerPage === 0 ? array.slice(ind, ind + cardsPerPage) : null;
        })
        .filter(function (el) {
            return el;
        });
    return splitedArray;
}
// ===========================================================



// ===========================================================
// PAGINATION
// ===========================================================

paginationBox.addEventListener('click', onPaginationLibraryClick);

// Функція рендеру кнопок пагінації
function paginationMarkupRender(currentPage, allPages) {
    let markup = '';
    let beforeTwoPage = currentPage - 2;
    let beforePage = currentPage - 1;
    globalCurrentPage = currentPage;
    let afterPage = currentPage + 1;
    let afterTwoPage = currentPage + 2;

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

// Функція обробки кліків пагінації
function onPaginationLibraryClick(event) {
    if (event.target.nodeName !== 'LI') {
        return;
    }
    if (event.target.textContent === '...') {
        return;
    }
    if (event.target.textContent === '🡸') {
        window.scrollTo(0, 0);
        if (cards.dataset.position === watchedAttr) {
            globalCurrentPage -= 1;
            contentRender(WATCHED_STORAGE_KEY, watchedAttr, globalCurrentPage);
            return;
        }
        if (cards.dataset.position === queuedAttr) {
            globalCurrentPage -= 1;
            contentRender(QUEUE_STORAGE_KEY, queuedAttr, globalCurrentPage);
            return;
        }
    }
    if (event.target.textContent === '🡺') {
        window.scrollTo(0, 0);
        if (cards.dataset.position === watchedAttr) {
            globalCurrentPage += 1;
            contentRender(WATCHED_STORAGE_KEY, watchedAttr, globalCurrentPage);
            return;
        }
        if (cards.dataset.position === queuedAttr) {
            globalCurrentPage += 1;
            contentRender(QUEUE_STORAGE_KEY, queuedAttr, globalCurrentPage);
            return;
        }
    }

    const page = Number(event.target.textContent);
    globalCurrentPage = page;
    window.scrollTo(0, 0);
    if (cards.dataset.position === watchedAttr) {
        contentRender(WATCHED_STORAGE_KEY, watchedAttr, globalCurrentPage);
        return;
    }
    if (cards.dataset.position === queuedAttr) {
        contentRender(QUEUE_STORAGE_KEY, queuedAttr, globalCurrentPage);
        return;
    }
}



// ===========================================================
// Модальне вікно
// Функції відкриття / закриття модалки
// ===========================================================
async function onModalOpenClick(event) {
    event.preventDefault();
    if (event.target.closest('li')) {
        modalEl.classList.remove('is-hidden');
        modalCloseEl.addEventListener('click', onModalCloseClick);
        backdropEl.addEventListener('click', onBackdropElClick);
        window.addEventListener('keydown', onEscBtnClick);
        // Присвоюю модалці кількість фільмів, що є в локалСторедж
        if (cards.dataset.position === watchedAttr) {
            let filmAmount = readFromLS(WATCHED_STORAGE_KEY).length;
            modalEl.dataset.filmAmount = filmAmount;
        }
        if (cards.dataset.position === queuedAttr) {
            let filmAmount = readFromLS(QUEUE_STORAGE_KEY).length;
            modalEl.dataset.filmAmount = filmAmount;
        }


    }

}

function onModalCloseClick() {
    modalEl.classList.add('is-hidden');
    modalCloseEl.removeEventListener('click', onModalCloseClick);
    backdropEl.removeEventListener('click', onBackdropElClick);
    window.removeEventListener('keydown', onEscBtnClick);

    // =========================================================
    if (cards.dataset.position === watchedAttr) {
        // data-position="watched" data-page="1"
        let currPageAttr = Number(cards.dataset.page);
        let currFilmAmount = Number(modalEl.dataset.filmAmount)
        let renewedFilmArr = readFromLS(WATCHED_STORAGE_KEY);
        let renewedAllPages = splitArrayOnSubarrays(renewedFilmArr).length;


        // Перемальовака, коли в нас одна сторінка і лише один елемент на сторінці,
        // який ми видаляємо
        // if (!renewedAllPages && currPageAttr === 1)
        if (!renewedAllPages) {
            console.log("Тут заглушка");
            emptyEl.innerHTML = `
            <div class="empty">
                <p class="empty__text">Ooops...You didn't select any movie</p>
                <img src="${searchMan}" alt="Man searching" class="empty__img" />
            </div>
        `;
            cards.innerHTML = '';
            return;
        }

        // Перемальовка, коли в нас більше однієї сторінки,
        // Ми перебуваємо на останній сторінці, на якій лише один елемент на сторінці,
        // який ми видаляємо
        if (currPageAttr > renewedAllPages) {
            contentRender(WATCHED_STORAGE_KEY, watchedAttr, renewedAllPages);
        }

        // Перемальовка, коли наш атрибут, що позначає загальну кількість фільмів
        // в локалСторедж на момент відкриття модалки не рівний довжині масиву
        // усіх фільмів в локалСторедж.
        // Тобто перемальовка виконуватиметься лише при видаленні фільму
        if (currFilmAmount !== renewedFilmArr.length) {
            contentRender(WATCHED_STORAGE_KEY, watchedAttr, renewedAllPages);
        }
    }
    // =========================================================


    // =========================================================
    if (cards.dataset.position === queuedAttr) {
        // data-position="watched" data-page="1"
        let currPageAttr = Number(cards.dataset.page);
        let currFilmAmount = Number(modalEl.dataset.filmAmount)
        let renewedFilmArr = readFromLS(QUEUE_STORAGE_KEY);
        let renewedAllPages = splitArrayOnSubarrays(renewedFilmArr).length;


        // Перемальовака, коли в нас одна сторінка і лише один елемент на сторінці,
        // який ми видаляємо
        // if (!renewedAllPages && currPageAttr === 1) {
        if (!renewedAllPages) {
            console.log("Тут заглушка");
            emptyEl.innerHTML = `
            <div class="empty">
                <p class="empty__text">Ooops...You didn't select any movie</p>
                <img src="${searchMan}" alt="Man searching" class="empty__img" />
            </div>
        `;
            cards.innerHTML = '';
            return;
        }

        // Перемальовка, коли в нас більше однієї сторінки,
        // Ми перебуваємо на останній сторінці, на якій лише один елемент на сторінці,
        // який ми видаляємо
        if (currPageAttr > renewedAllPages) {
            contentRender(QUEUE_STORAGE_KEY, queuedAttr, renewedAllPages);
        }

        // Перемальовка, коли наш атрибут, що позначає загальну кількість фільмів
        // в локалСторедж на момент відкриття модалки не рівний довжині масиву
        // усіх фільмів в локалСторедж.
        // Тобто перемальовка виконуватиметься лише при видаленні фільму
        if (currFilmAmount !== renewedFilmArr.length) {
            contentRender(QUEUE_STORAGE_KEY, queuedAttr, renewedAllPages);
        }
    }





    // 



    // ------------------------------------------------


}

function onBackdropElClick(event) {
    if (event.target === backdropEl) {
        onModalCloseClick();
    }
}

function onEscBtnClick(event) {
    if (event.code === 'Escape') {
        onModalCloseClick();
    }
}