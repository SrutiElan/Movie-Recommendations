import React, { useState } from "react";
import {Movie, RecommendedMovie} from "../types";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import GlobalStyle from "../styles/styles";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import MovieRecommendations from "./MovieRecommendations";

interface MovieDetailsProps {
  movie:Movie;
  onSave: (thoughts: string, rating?: 'thumbs_up' | 'thumbs_down' | null) => void;
  showDelete: boolean;
  onDelete?: () => void;
    onAddToWatchlist?: (movie: RecommendedMovie) => void;

}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onSave,
  onDelete,
  showDelete,
  onAddToWatchlist,
}) => {
  const [myThoughts, setThoughts] = useState(movie.thoughts);
  const [rating, setRating] = useState<'thumbs_up' | 'thumbs_down' | null>(
    movie.rating || null
  );
    // Get all user movies for recommendations
  const allUserMovies = useSelector((state: RootState) => state.movies.movies);

  const handleRating = (newRating: 'thumbs_up' | 'thumbs_down') => {
    const updatedRating = rating === newRating ? null : newRating;
    setRating(updatedRating);
  };

  const handleSave = () => {
    onSave(myThoughts, rating);
  }
  
    const handleAddToWatchlist = (recommendedMovie: RecommendedMovie) => {
    if (onAddToWatchlist) {
      onAddToWatchlist(recommendedMovie);
    } else {
      Alert.alert("Added to Watchlist", `${recommendedMovie.title} has been added to your watchlist!`);
    }
  };

  return (
    <View style={{ height: `auto`, width: `100%` }}>
      <View style={{ flexDirection: "row", width: `100%` }}>
        <View
          style={{
            flexDirection: "column",
            width: `30%`,
            paddingVertical: 7,
            paddingRight: 5,
          }}
        >
          <Text style={GlobalStyle.labelText}>DATE RELEASED</Text>
          <Text style={GlobalStyle.details}>{movie.movieData.release_date}</Text>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.movieData.poster_path}`,
            }}
            style={{ width: `100%`, aspectRatio: "2/3", marginTop: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            width: `70%`,
            paddingVertical: 7,
            paddingLeft: 5,
          }}
        >
          <Text style={GlobalStyle.labelText}>SUMMARY</Text>
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 10,
              textAlignVertical: "top",
            }}
          >
            {movie.movieData.overview}
          </Text>
        </View>
      </View>

      {/* NEW: Rating Section */}
      <View style={styles.ratingSection}>
        <Text style={GlobalStyle.labelText}>YOUR RATING</Text>
        <View style={styles.ratingButtons}>
          <TouchableOpacity
            style={[
              styles.ratingButton,
              rating === 'thumbs_up' && styles.ratingButtonActive
            ]}
            onPress={() => handleRating('thumbs_up')}
          >
            <Ionicons 
              name="thumbs-up" 
              size={20} 
              color={rating === 'thumbs_up' ? '#4CAF50' : '#ccc'} 
            />
            <Text style={[
              styles.ratingText,
              rating === 'thumbs_up' && styles.ratingTextActive
            ]}>
              Like
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.ratingButton,
              rating === 'thumbs_down' && styles.ratingButtonActive
            ]}
            onPress={() => handleRating('thumbs_down')}
          >
            <Ionicons 
              name="thumbs-down" 
              size={20} 
              color={rating === 'thumbs_down' ? '#f44336' : '#ccc'} 
            />
            <Text style={[
              styles.ratingText,
              rating === 'thumbs_down' && styles.ratingTextActive
            ]}>
              Dislike
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      <Text style={GlobalStyle.labelText}>MY THOUGHTS</Text>
      <View style={styles.thoughtsBox}>
        <TextInput
          style={[styles.thoughtsText]}
          value={myThoughts}
          placeholder="Rating?"
          onChangeText={setThoughts}
          multiline={true}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: (showDelete && 1) || 0,
        }}
      >
        {showDelete && (
          // <TouchableOpacity
          //   style={[
          //     GlobalStyle.buttonOutline,
          //     {
          //       marginRight: `10%`,
          //
          //       flex: 1,
          //     },
          //   ]}
          //   onPress={onDelete}
          // >
          //   <Text style={[GlobalStyle.buttonText, { color: "gray" }]}>
          //     Delete
          //   </Text>
          // </TouchableOpacity>
          <Ionicons
            name="trash-bin-outline"
            size={15}
            color="red"
            onPress={onDelete}
            marginRight={`10%`}
            flex={1}
          />
        )}
        <TouchableOpacity
          style={[GlobalStyle.button, { flex: (showDelete && 0.75) || 1 }]}
          onPress={handleSave}
        >
          <Text style={GlobalStyle.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* NEW: Movie Recommendations Section */}
      {showDelete && rating && (
        <MovieRecommendations
          userMovies={allUserMovies}
          onAddToWatchlist={handleAddToWatchlist}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 80,
    marginHorizontal: "10%",
    height: `100%`,
    width: `80%`,
  },

  movieBox: {
    width: "100%",
    height: "auto",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    padding: 10,
    alignItems: "stretch", // Allow children to stretch
    flexDirection: "column", // Ensure children are stacked vertically
  },
  searchBar: {
    height: 25,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "auto",
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
  },
  suggestion: {
    marginTop: 2,
    fontFamily: "Inter",
    fontSize: 3,
    letterSpacing: 0.4,
    opacity: 0.32,
  },
  suggestionBox: {
    borderWidth: 0.5,
    borderColor: "#999999",
    borderRadius: 4,
    paddingHorizontal: 8,
  },

  thoughtsBox: {
    marginBottom: 12,
    padding: 8,
    width: "100%",
    backgroundColor: "#F5F5F5",
    justifyContent: "flex-start",
    borderRadius: 4,
    minHeight: `5%`,
    maxHeight: `20%`, // Set the maximum height for the input
    overflow: "scroll", // Make the input scrollable if content exceeds maxHeight
  },

  thoughtsText: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 10,
    textAlignVertical: "top",
  },
  ratingSection: {
    marginVertical: 15,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  ratingButtonActive: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  ratingTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default MovieDetails;
