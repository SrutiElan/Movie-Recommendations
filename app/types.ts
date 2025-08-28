export interface Movie {
  ID: string; // Firestore document ID
  thoughts: string;
  movieData: {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    genre_ids: number[];
    vote_average: number;
    poster_path: string;
    // Add any other TMDB fields you're using
  };
  rating?: 'thumbs_up' | 'thumbs_down' | null; // New rating field
  dateAdded?: Date;
}

export interface RecommendedMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  similarity_score: number;
  reasons: string[]; // Why this was recommended
}


export interface UserPreferences {
  favoriteGenres: string[];
  averageRating: number;
  preferredDecade: string;
  totalMoviesRated: number;
}