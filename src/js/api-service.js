'use strict';
import axios from 'axios';

// https://api.themoviedb.org/3/trending/movie/week/b04a034fc18f8d6bb9fee9f009f99d0d
const API_KEY = 'b04a034fc18f8d6bb9fee9f009f99d0d';
const BASE_URL = 'https://api.themoviedb.org/3';
const popular = BASE_URL + '/trending/movie/week' + '?api_key=' + API_KEY;
// const imageURL = 'https://image.tmdb.org/t/p/w500' + relativeImageURL;
// console.log(popular);

// getMovies(popular);
// function getMovies(url) {
//     fetch(url).then(res => res.json()).then(data => showMovies(data.results));
// }
// function showMovies(data) {
//     console.log(data[0]);
// }

// Зразок запиту на картинку до конкретного фільму
// https://image.tmdb.org/t/p/w500/bQXAqRx2Fgc46uCVWgoPz5L5Dtr.jpg

// Зразок запиту на повернення порції різноманітних картинок
// https://api.themoviedb.org/3/movie/436270/images?api_key=b04a034fc18f8d6bb9fee9f009f99d0d
// - повертається масив об'єктів постерами різних розмірів та різними мовами


export class MovieDB {
    #BASE_URL = 'https://api.themoviedb.org/3';
    #API_KEY = 'b04a034fc18f8d6bb9fee9f009f99d0d';

    constructor() {
        this.page = null;
        this.searchQuery = null;
    }

    fetchData() {
        const searchParams = {
            params: {
                key: this.#API_KEY,
                q: this.searchQuery,
                // image_type: 'photo',
                // orientation: 'horizontal',
                // safesearch: 'true',
                page: this.page,
                // per_page: '40',
            },
        };

        return axios.get(`${this.#BASE_URL}/trending/movie/week?api_key=${this.#API_KEY}`, searchParams);
    }
}



// Заготовка властивостей для картки
// ІД - id
// Постер - backdrop_path та poster_path
// Назва - title
// Жанри - повертається масив із id, тут треба буде написати функцію, яка повертає назви жанрів відповідно до їх id
// Рік - release_date, повертає рядок типу "2022-11-25". Треба обрізати лишнє
// Оцінка (в бібліотеці) - vote_average

// Заготовка властитвостей на модальне вікно
// ІД - id
// Постер - backdrop_path та poster_path
// Назва - title
// Рейтинг / голоси - vote_average / vote_count
// Популярність - popularity
// Оригінальна назва - original_title
// Жанри - повертається масив із id, тут треба буде написати функцію, яка повертає назви жанрів відповідно до їх id
// Опис - overview