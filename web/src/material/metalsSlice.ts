/**
 * metalsSlice.ts
 * Slice file for managing state for metals within materials app.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getMetals } from "./_api";

// Enums
import { Status } from "enums";

// Types
export interface MetalsSliceInitialState extends AsyncThunkInitialState {
  data: [];
  // response: {
  //   count: null | number;
  //   next: null | string;
  //   previous: null | string;
  //   results: string[];
  // };
}

// Constants
const initialState: MetalsSliceInitialState = {
  // response: {
  //   count: null,
  //   next: null,
  //   previous: null,
  //   results: [],
  // },
  data: [],
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool records.
 */
export const fetchMetals = createAsyncThunk(
  "material/fetchMetals",
  async () => {
    const response = await getMetals();
    return response;
  },
);

export const slice = createSlice({
  name: "materialMetals",
  initialState,
  reducers: {
    setMetals: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      // state.response.count = action.payload.count;
      // state.response.next = action.payload.next;
      // state.response.previous = action.payload;
      // state.response.results = action.payload.results;
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMetals.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchMetals.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        // state.response = action.payload;
        state.data = action.payload;
      })
      .addCase(fetchMetals.rejected, (state, action) => {
        state.status = Status.Failed;
        // state.response = {
        //   count: null,
        //   next: null,
        //   previous: null,
        //   results: [],
        // };
        state.data = [];
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setMetals } = slice.actions;

export default slice.reducer;
