// services/tmdb.js
import axios from "axios";


const searchMovies = async (query) => {
  const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/movie',
  params: {include_adult: 'true', language: 'en-US', query: query},
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmFhMDJmMmU1MmMxZjkwYTQxYzI0ODQ4YzRlNjFlYiIsIm5iZiI6MTcyMzkyMzIzOC44OTQsInN1YiI6IjY2YzBmYjI2YTIyMTM5YThkOWMyMDg0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kERaJIR3II-bQIWjXE_1XAk6wcT9j4ONimiTUbTRBm0'
  }
};

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {i
    console.error("Error fetching movie data from API", error);
    return [];
  }
};

export default searchMovies;

const fetchGenres = async () => {

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/genre/movie/list',
  params: {language: 'en'},
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmFhMDJmMmU1MmMxZjkwYTQxYzI0ODQ4YzRlNjFlYiIsIm5iZiI6MTcyMzkyMzIzOC44OTQsInN1YiI6IjY2YzBmYjI2YTIyMTM5YThkOWMyMDg0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kERaJIR3II-bQIWjXE_1XAk6wcT9j4ONimiTUbTRBm0'
  }
};

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {i
    console.error("Error fetching genres from API", error);
    return [];
  }
}
export {fetchGenres}; 