/**
 * slice.ts
 * Slice file for managing state associated with Auth0
 */

// Node Modules
import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth0',
  initialState: {
    // token: null,
  },
  reducers: {
    // setToken: (state, action) => {
    //   state.token = action.payload.token;
    // },
  },
});

// export const { setToken } = slice.actions;

export default slice.reducer;
