export interface Movie {
    ID: string; // Firestore document ID
    thoughts: string; // User-added thoughts
    movieData: {
      title: string;
      overview: string;
      release_date: string;
      poster_path: string;
      id: string;
      // Add other API fields as needed
    };
  }