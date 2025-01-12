import React, { useState } from "react";
import {Movie} from "../types";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import GlobalStyle from "../styles/styles";
import { Ionicons, Entypo } from "@expo/vector-icons";

interface MovieDetailsProps {
  movie:Movie;
  onSave: (thoughts: string) => void;
  showDelete: boolean;
  onDelete?: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onSave,
  onDelete,
  showDelete,
}) => {
  const [myThoughts, setThoughts] = useState(movie.thoughts);

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
          onPress={() => [onSave(myThoughts)]}
        >
          <Text style={GlobalStyle.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
});

export default MovieDetails;
