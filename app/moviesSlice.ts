import { createSlice, createAsyncThunk } from "@reduxjs/toolkit/src";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { Movie } from "./types";

const db = getFirestore();
const auth = getAuth();

interface MovieState {
  movies: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: MovieState = {
  movies: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch movies from Firestore
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is logged in");
  try {
    const querySnapshot = await getDocs(
      collection(FIRESTORE_DB, "users", user.uid, "movies")
    );
    const movies: Movie[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      movies.push({
        ID: doc.id,
        thoughts: data.thoughts || "", // Default to empty string if undefined
        movieData: data.movieData, // Store the API-provided details here
      });
    });
    return movies;
  } catch (error) {
    console.error("Error getting movies for user " + user.email);
    throw error;
  }
});

//thunk to add a new movie
export const addMovie = createAsyncThunk(
  "movies/addMovie",
  async (movieData: Movie) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in");

      try {
        const { thoughts, movieData: apiData } = movieData;
        const docRef = await addDoc(
          collection(FIRESTORE_DB, "users", user.uid, "movies"),
          {
            movieData: apiData,
            thoughts: thoughts || "",
          }
        );  
        console.log("Movie added successfully");
        return {
          ID: docRef.id,
          thoughts,
          movieData: apiData,
        };      
      } catch (error) {
        console.error("Error adding movie:", error);
        throw error;
      }
    
  }
);

// Thunk to delete a movie
export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (movie: Movie) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in");
    try {
      const docRef = doc(FIRESTORE_DB, "users", user.uid, `movies/${movie.ID}`);
      await deleteDoc(docRef).then(() => {
        alert(`${movie.movieData.title} has been deleted successfully.`);
      });
    } catch (error) {
      console.error("Error deleting movie:", error);
    }

    return movie.ID;
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ movieId, newData }: { movieId: string; newData: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in");

    try {
      const docRef = doc(FIRESTORE_DB, "users", user.uid, "movies", movieId);
      console.log(
        `Updating movie with ID: ${movieId} and new data: ${newData}`
      );

      await updateDoc(docRef, { thoughts: newData });

      // Fetch the updated document and return properly structured data
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        ID: movieId,
        thoughts: newData,
        movieData: updatedData?.movieData, // ✅ properly nested
      };
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload || [];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload);
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.status = "idle";

        state.movies = state.movies.filter(
          (movie) => movie.ID !== action.payload
        );
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(
          (movie) => movie.ID === action.payload.ID
        );
        state.status = "idle";

        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      });
  },
});

export default moviesSlice.reducer;
