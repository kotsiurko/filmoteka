'use strict';
import axios from 'axios';

// https://api.themoviedb.org/3/trending/movie/week/b04a034fc18f8d6bb9fee9f009f99d0d
// const API_KEY = 'b04a034fc18f8d6bb9fee9f009f99d0d';
// const BASE_URL = 'https://api.themoviedb.org/3';
// const popular = BASE_URL + '/trending/movie/week' + '?api_key=' + API_KEY;
// const imageURL = 'https://image.tmdb.org/t/p/w500' + relativeImageURL;
// console.log(popular);

// Зразок запиту на пошук фільмів без додаткових параметрів
// https://api.themoviedb.org/3/search/collection?api_key=b04a034fc18f8d6bb9fee9f009f99d0d&query=<<searchQuery>>

// Зразок запиту на картинку до конкретного фільму
// https://image.tmdb.org/t/p/w500/bQXAqRx2Fgc46uCVWgoPz5L5Dtr.jpg

// Зразок запиту на повернення порції різноманітних картинок
// https://api.themoviedb.org/3/movie/436270/images?api_key=b04a034fc18f8d6bb9fee9f009f99d0d
// - повертається масив об'єктів постерами різних розмірів та різними мовами


export class MovieDB {
    #BASE_URL = 'https://api.themoviedb.org/3';
    #API_KEY = 'b04a034fc18f8d6bb9fee9f009f99d0d';
    // #MovieId = '343611';

    fetchTrendMovies() {
        return axios.get(`${this.#BASE_URL}/trending/movie/week?api_key=${this.#API_KEY}`);
    }

    fetchSearch() {
        // return axios.get(`${this.#BASE_URL}/trending/movie/week?api_key=${this.#API_KEY}`, searchParams);
        return axios.get(`${this.#BASE_URL}/search/movie?api_key=${this.#API_KEY}&query=${this.searchQuery}`);
    }

    fetchMovieById(id) {
        return axios.get(`${this.#BASE_URL}/movie/${id}?api_key=${this.#API_KEY}`);
        // /movie/343611?api_key={api_key}
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





// ЗРАЗОК ОБ'ЄКТУ, ЯКИЙ ПРИХОДИТЬ ЯК РЕЗУЛЬТАТ ПОШУКУ
// adult: false
// backdrop_path: "/c5RvuFVBu3oN1EysVlPI0VTx7kZ.jpg"
// id: 916692
// name: "Adam Collection"
// original_language: "en"
// original_name: "Adam Collection"
// overview: "Adam is a collection of real-time-rendered short film created with the Unity engine.  The story follow an amnesiac robot."
// poster_path: "/ldV5iWYUtMbwU1tHK0n9PuOKu1x.jpg"