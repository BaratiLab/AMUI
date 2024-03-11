/**
 * themeSlice.ts
 * Redux toolkit slice for handling theme palette mode.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { PaletteMode } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';

// Types
interface InitialState {
  mode: PaletteMode
}

// Constants
const initialState: InitialState = {
  mode: 'dark',
}

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePaletteMode: (state, action) => {
      state.mode = action.payload;
    },
    toggleThemePalleteMode: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

// Action creators are generated for each case reducer function
export const { setThemePaletteMode, toggleThemePalleteMode } = slice.actions;

export default slice.reducer;
