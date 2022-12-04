'use strict';
import axios from 'axios';

export class MovieDB {
  #BASE_URL = 'https://api.themoviedb.org/3';
  #API_KEY = 'b04a034fc18f8d6bb9fee9f009f99d0d';

  fetchTrendMovies(page) {
    return axios.get(
      `${this.#BASE_URL}/trending/movie/week?api_key=${this.#API_KEY}&page=${page}`
    );
  }

  fetchSearch(page) {
    return axios.get(`${this.#BASE_URL}/search/movie?api_key=${this.#API_KEY}&query=${this.searchQuery}&page=${page}`);
  }

  fetchMovieById(id) {
    return axios.get(`${this.#BASE_URL}/movie/${id}?api_key=${this.#API_KEY}`);
  }

  getMovieTrailer(id) {
    return axios.get(`${this.#BASE_URL}/movie/${id}/videos?api_key=${this.#API_KEY}`);
  }
}