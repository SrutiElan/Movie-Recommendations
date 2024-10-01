// import {configureStore} from '@reduxjs/toolkit'
// import type {Action} from '@reduxjs/toolkit'


// const INITIAL_STATE = {
//     current: [],
// }

// const movieReducer = (state = INITIAL_STATE, action: Action) => {
//     switch (action.type){
//         case "ADD_MOVIE":
//             const {current} = state;
            
//             default: {
//                 return state
//             }
//     }


// }

// export const store = configureStore({
//       // Pass in the root reducer setup as the `reducer` argument
//     reducer: {
//         // Declare that `state.movies` will be updated by the `movieReducer` function
//         movies: movieReducer
//     }
// })

// export default store;
import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./moviesSlice";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;