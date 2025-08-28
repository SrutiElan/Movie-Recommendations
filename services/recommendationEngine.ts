import { Movie, RecommendedMovie } from '../app/types';
import { popularMovies } from './tmbd';
interface MovieFeatures {
  id: number;
  title: string;
  overview: string;
  genres: string[];
  year: number;
  rating: number;
  features: number[];
}


class MovieRecommendationEngine {
  private movieDatabase: MovieFeatures[] = [];
  private genreMap: { [key: number]: string } = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

constructor() {
    this.initializeMovieDatabase();
}

private async initializeMovieDatabase() {
    const movies = await popularMovies();
    //console.log("Fetched popular movies for recommendation engine:", movies);
    this.movieDatabase = movies.map((movie: any) => this.processMovieFeatures(movie));
}

private processMovieFeatures(movie: any): MovieFeatures {
    const genres = movie.genre_ids.map((id: number) => this.genreMap[id] || 'Unknown');
    // const year = movie.release_date ? parseInt(movie.movieData.release_date.split('-')[0]) : 0;
    const year = new Date(movie.release_date).getFullYear() || 2020;

    // const rating = movie.vote_average || 0;

    // Simple feature vector: [year, rating, genre1, genre2, ...]
    const features = [
      ...this.createGenreVector(movie.genre_ids),
      this.normalizeRating(movie.vote_average),
      this.normalizeYear(year),
      ...this.createTFIDFVector(movie.overview)
    ];

    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        genres,
        year,
        rating: movie.vote_average,
        features
    };
}
// Create one-hot encoded genre vector
  private createGenreVector(genreIds: number[]): number[] {
    const allGenres = Object.keys(this.genreMap).map(Number);
    return allGenres.map(genreId => genreIds.includes(genreId) ? 1 : 0);
  }

  // Normalize rating to 0-1 scale
  private normalizeRating(rating: number): number {
    return rating / 10;
  }

  // Normalize year to recent preference (higher for newer movies)
  private normalizeYear(year: number): number {
    const currentYear = new Date().getFullYear();
    return Math.max(0, (year - 1900) / (currentYear - 1900));
  }

  private createTFIDFVector(text: string): number[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
    const importantWords = ['action', 'comedy', 'drama', 'thriller', 'horror', 'romance', 'adventure', 'family', 'crime', 'mystery'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));

    // Create feature vector based on important word presence
    return importantWords.map(word => 
      words.filter(w => w.includes(word)).length > 0 ? 1 : 0
    );
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * (vecB[idx] || 0), 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

// private createUserProfile(likedMovies: Movie[]): MovieFeatures {
//     const movieFeatures = likedMovies.map(movie => this.processMovieFeatures(movie.movieData));

//     const avgFeatures = movieFeatures[0].
// }

  public getRecommendations(userMovies: Movie[], topN: number = 5): RecommendedMovie[] {
    const likedMovies = userMovies.filter(m => m.rating === 'thumbs_up');
    if (likedMovies.length === 0) {
        return this.getPopularRecommendations();
    }
    // create user profile by averaging liked movie features
    const userProfile = this.createUserProfile(likedMovies);

    //calculate similarties and rank the recommendations
    const recommendations = this.movieDatabase
        .filter(dbMovie => !userMovies.some(userMovie => userMovie.movieData.id === dbMovie.id))
        .map(dbMovie => ({
            ...dbMovie,
            similarity_score: this.cosineSimilarity(userProfile.features, dbMovie.features),
            reasons: this.generateReasons(userProfile, dbMovie)
        }))
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, topN)
        .map(rec => ({
            id: rec.id,
            title: rec.title,
            overview: rec.overview,
            poster_path: '', //(popularMovies().results.find((m: any) => m.id === rec.id) || {}).poster_path || '', //implement this later
            genre_ids: Object.keys(this.genreMap).filter(key => rec.genres.includes(this.genreMap[parseInt(key)])).map(Number),
            vote_average: rec.rating,
            similarity_score: rec.similarity_score,
            reasons: rec.reasons
        }));
    return [];
  }

  private createUserProfile(likedMovies: Movie[]): MovieFeatures {
    const movieFeatures = likedMovies.map(movie => this.processMovieFeatures(movie.movieData));
    const featureLength = movieFeatures[0].features.length;
    const avgFeatures = new Array(featureLength).fill(0);

    movieFeatures.forEach(mf => {
        mf.features.forEach((value, idx) => {
            avgFeatures[idx] += value;
        });
    });

    for (let i = 0; i < featureLength; i++) {
        avgFeatures[i] /= movieFeatures.length;
    }
    const commonGenres = this.findCommonGenres(likedMovies);

    return {
        id: 0,
        title: 'User Profile',
        overview: '',
        genres: commonGenres,
        year: 0, // new Date().getFullYear(),
        rating: 0,
        features: avgFeatures
    };
  }

  private findCommonGenres(movies:Movie[]) : string[] {
    const genreCount: { [genre: string] : number } = {}; // count of all genres in liked movies 
    movies.forEach(movie => {
        movie.movieData.genre_ids.forEach(genreId => {
          const genre = this.genreMap[genreId];
          if (genre){
                genreCount[genre] = (genreCount[genre] || 0) + 1;

            }
        });
    });
  return Object.entries(genreCount) //converts to array of [genreName, count]
        .sort(([genreA, a], [genreB, b]) => b - a).slice(0, 3) // sort the pairs by highest frequency genres, take top 3 genres
        .map(([genre]) => genre); //returns j the name of the genre

}

// Generate explanation for why a movie is recommended
  private generateReasons(userProfile: MovieFeatures, recommendedMovie: MovieFeatures): string[] {
    const reasons: string[] = [];
    
    // Check genre overlap
    const sharedGenres = userProfile.genres.filter(genre => 
      recommendedMovie.genres.includes(genre)
    );
    if (sharedGenres.length > 0) {
      reasons.push(`Similar genres: ${sharedGenres.join(', ')}`);
    }

    // Check rating similarity
    if (Math.abs(userProfile.rating - recommendedMovie.rating) < 1) {
      reasons.push('Highly rated like your preferences');
    }

    // Check year preference
    if (Math.abs(userProfile.year - recommendedMovie.year) < 5) {
      reasons.push('From a similar time period');
    }

    return reasons.length > 0 ? reasons : ['Based on your viewing history'];
  }

  // Get popular movies as fallback
  private getPopularRecommendations(): RecommendedMovie[] {
    return this.movieDatabase
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: '', // Will be fetched separately
        genre_ids: Object.keys(this.genreMap).filter(key => 
          movie.genres.includes(this.genreMap[parseInt(key)])
        ).map(Number),
        vote_average: movie.rating,
        similarity_score: 0.8,
        reasons: ['Popular movie']
      }));
  }

  // Helper to get poster path (simplified)
  private getMoviePoster(movieId: number): string {
    // This would typically require another API call
    // For now, return empty string and handle in component
    return '';
  }

}

export default MovieRecommendationEngine;