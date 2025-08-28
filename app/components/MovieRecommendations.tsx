// app/components/MovieRecommendations.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie, RecommendedMovie } from '../types';
import GlobalStyle from '../styles/globals';
import MovieRecommendationEngine from '../../services/recommendationEngine';

interface MovieRecommendationsProps {
  userMovies: Movie[];
  onAddToWatchlist: (movie: RecommendedMovie) => void;
}

const MovieRecommendations: React.FC<MovieRecommendationsProps> = ({
  userMovies,
  onAddToWatchlist
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [dismissedMovies, setDismissedMovies] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [recommendationEngine] = useState(new MovieRecommendationEngine());

  useEffect(() => {
    generateRecommendations();
  }, [userMovies]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const recs = recommendationEngine.getRecommendations(userMovies);
      // Fetch poster paths for recommendations
    //   console.log("Generated recommendations:", recs.forEach(r => console.log(r.title)));
      const recsWithPosters = await Promise.all(
        recs.map(async (rec) => {
          const posterPath = await fetchMoviePoster(rec.id);
          return { ...rec, poster_path: posterPath };
        })
      );
      setRecommendations(recsWithPosters);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviePoster = async (movieId: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmFhMDJmMmU1MmMxZjkwYTQxYzI0ODQ4YzRlNjFlYiIsIm5iZiI6MTcyMzkyMzIzOC44OTQsInN1YiI6IjY2YzBmYjI2YTIyMTM5YThkOWMyMDg0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kERaJIR3II-bQIWjXE_1XAk6wcT9j4ONimiTUbTRBm0'
          }
        }
      );
      const data = await response.json();
      return data.poster_path || '';
    } catch (error) {
      console.error('Error fetching movie poster:', error);
      return '';
    }
  };

  const dismissMovie = (movieId: number) => {
    setDismissedMovies(prev => new Set([...prev, movieId]));
  };

  const handleAddToWatchlist = (movie: RecommendedMovie) => {
    onAddToWatchlist(movie);
    dismissMovie(movie.id);
  };

  const visibleRecommendations = recommendations.filter(
    rec => !dismissedMovies.has(rec.id)
  );

  const renderRecommendation = ({ item }: { item: RecommendedMovie }) => (
    <View style={styles.recommendationCard}>
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: item.poster_path 
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : 'https://via.placeholder.com/100x150/cccccc/ffffff?text=No+Image'
          }}
          style={styles.poster}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.similarity}>
            {Math.round(item.similarity_score * 100)}% match
          </Text>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => dismissMovie(item.id)}
        >
          <Ionicons name="close" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.overview} numberOfLines={3}>
        {item.overview}
      </Text>

      <View style={styles.reasonsContainer}>
        <Text style={styles.reasonsTitle}>Why we recommend this:</Text>
        {item.reasons.map((reason, index) => (
          <Text key={index} style={styles.reason}>
            • {reason}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToWatchlist(item)}
      >
        <Ionicons name="add" size={16} color="white" />
        <Text style={styles.addButtonText}>Add to Watchlist</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Generating recommendations...</Text>
      </View>
    );
  }

  if (visibleRecommendations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>You may like these movies</Text>
        <Text style={styles.emptyText}>
          Rate some movies with thumbs up/down to get personalized recommendations!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>You may like these movies</Text>
      <Text style={styles.subtitle}>
        Based on your preferences
      </Text>
      
      <FlatList
        data={visibleRecommendations}
        renderItem={renderRecommendation}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    height: '50%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  listContainer: {
    gap: 5,
    height: '100%',
  },
  recommendationCard: {
    width: 280,
    backgroundColor: '#ffffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  similarity: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2,
  },
  dismissButton: {
    padding: 5,
  },
  overview: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
    marginBottom: 12,
  },
  reasonsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  reasonsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reason: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#024023',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default MovieRecommendations;