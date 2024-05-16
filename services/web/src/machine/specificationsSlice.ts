/**
 * specificationsSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getSpecifications } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { SpecificationsSliceInitialState } from "./_types";

// Constants
const initialState: SpecificationsSliceInitialState = {
  response: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  data: [],
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available machine specifications.
 */
export const fetchSpecifications = createAsyncThunk(
  "machine/specifications",
  async () => {
    const response = await getSpecifications();
    return response;
  },
);

export const slice = createSlice({
  name: "machineSpecifications",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSpecifications.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchSpecifications.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
        state.data = action.payload.results;
      })
      .addCase(fetchSpecifications.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = {
          count: null,
          next: null,
          previous: null,
          results: [],
        };
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
