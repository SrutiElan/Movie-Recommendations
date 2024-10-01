import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import MovieDetails from "../components/MovieDetails";
import GlobalStyle from "../styles/styles";
interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  thoughts: string;
  // Add other fields as needed
}

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import searchMovies from "../../services/tmbd";
import { useDispatch } from "react-redux";
import { addMovie } from "../moviesSlice";
import { AppDispatch } from "../store";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddNewMovie">;
};

const AddNewMovie: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie>();
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = async () => {
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
      setMovie(undefined);
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const selectMovie = (movie: Movie) => {
    setMovie(movie);
    setSearchResults([]); // Clear movie suggestions after selecting a movie
    setQuery(movie.title); // Update the query to the selected movie's title
  };

  const addMovieWithRedux = (myThoughts: any) => {
    if (!movie) return;

    const movieWithThoughts = {
      ...movie,
      thoughts: myThoughts,
      watched: false,
    };

    dispatch(addMovie(movieWithThoughts));
    setMovie(undefined);
    alert("Movie saved with thoughts!");
    navigation.goBack();
  };

  return (
    <View style={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={GlobalStyle.titleText}>Add New Movie</Text>
        <TouchableOpacity
          style={GlobalStyle.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={GlobalStyle.buttonText}>Go Back Home</Text>
        </TouchableOpacity>
        <View style={styles.movieBox}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for a movie..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {/* <Button title="Search" onPress={handleSearch} /> */}
          {searchResults.length != 0 && (
            <FlatList
              style={styles.suggestionBox}
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => selectMovie(item)}
                >
                  <Text style={GlobalStyle.details}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {movie && (
            <MovieDetails
              movie={movie}
              onSave={addMovieWithRedux}
              showDelete={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: `100%`,
    width: `100%`,
  },
  container: {
    justifyContent: "flex-start",
    marginVertical: 80,
    marginHorizontal: "10%",
    height: `80%`,
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
    marginTop: `5%`,
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
    flexGrow: 1, // Allow the input to grow vertically
    maxHeight: 100, // Set the maximum height for the input
    minHeight: "20%", // Set a minimum height for better visibility
    overflow: "scroll", // Make the input scrollable if content exceeds maxHeight
  },
});

export default AddNewMovie;
