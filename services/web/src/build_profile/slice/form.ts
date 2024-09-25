/**
 * form.ts
 * Slice file for managing state associated with build profile form component.
 */

// Node Modules
import { createSlice } from '@reduxjs/toolkit';

// Constants
const INITIAL_STATE = {
  id: null,
  title: '',
  description: '',
  created_on: null,
  updated_on: null,
}

export const slice = createSlice({
  name: 'buildProfile/form',
  initialState: INITIAL_STATE,
  reducers: {
    reset: () => INITIAL_STATE, 
    setBuildProfileForm: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.created_on = action.payload.created_on;
      state.updated_on = action.payload.updated_on;
    },
  },
})

// Action creators are generated for each case reducer function
export const { reset, setBuildProfileForm } = slice.actions;

export default slice.reducer;