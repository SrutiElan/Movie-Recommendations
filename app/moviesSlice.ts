import { createSlice, createAsyncThunk } from '@reduxjs/toolkit/src';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';

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
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'movies'));
  const movies= <any>[];
  querySnapshot.forEach((doc) => {
    movies.push({ ID: doc.id, ...doc.data() });
  });
  return movies;
});


//thunk to add a new movie
export const addMovie = createAsyncThunk("movies/addMovie", async (movieData: any) => {
  try {
    const docRef = await addDoc(
        collection(FIRESTORE_DB, "movies"),
        movieData
      );
      console.log("Movie added successfully");
      return { ID: docRef.id, ...movieData };

    } catch (error) {
      console.error("Error adding movie:", error);

    }

  });

  // Thunk to delete a movie
export const deleteMovie = createAsyncThunk("movies/deleteMovie", async (movie:any ) => {
    const docRef = doc(FIRESTORE_DB, `movies/${movie.ID}`);

    await deleteDoc(docRef).then(() => {
        alert(`${movie.title} has been deleted successfully.`);
      })
      .catch((error) => {
        console.log(error);
      });
    return movie.ID;
  });
  
  export const updateMovie = createAsyncThunk(
    "movies/updateMovie",
    async ({ movieId, newData }: { movieId: string; newData: string }) => {
      const docRef = doc(FIRESTORE_DB, `movies/${movieId}`);
      console.log(`Updating movie with ID: ${movieId} and new data: ${newData}`);
  
      await updateDoc(docRef, { thoughts: newData });
  
      // Return the updated movie data
      const updatedDoc = await getDoc(docRef);
      return { ID: movieId, ...updatedDoc.data() };
    }
  );

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
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

        state.movies = state.movies.filter(movie => movie.id !== action.payload);
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(movie => movie.id === action.payload.ID);
        state.status = "idle";

        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      });
  },
});

export default moviesSlice.reducer;
