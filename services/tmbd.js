// services/tmdb.js
import axios from "axios";

const API_KEY = "9faa02f2e52c1f90a41c24848c4e61eb";
const BASE_URL = "https://api.themoviedb.org/3";

const searchMovies = async (query) => {
  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/movie",
    params: {
      include_adult: "true",
      query: query,
    },
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmFhMDJmMmU1MmMxZjkwYTQxYzI0ODQ4YzRlNjFlYiIsIm5iZiI6MTcyMzkyMzc2Ny4xODQ0NjYsInN1YiI6IjY2YzBmYjI2YTIyMTM5YThkOWMyMDg0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2dEWC3rrPnl6f_mzalL9OwL8euVBhL1i0N9JYtXnIqw",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching data from API", error);
    return [];
  }
};

export default searchMovies;
