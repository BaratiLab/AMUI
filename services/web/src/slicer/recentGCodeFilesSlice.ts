/**
 * recentGCodeFilesSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getRecentGCodeFiles } from "./_api";

// Enums
import { Status } from "enums";

// Types
// import { MeltPoolFilterset, MeltPoolRecord } from "./_types";
export interface RecordsSliceInitialState extends AsyncThunkInitialState {
  // data: [];
  response: [];
}

// Constants
const initialState: RecordsSliceInitialState = {
  response: [],
  status: Status.Idle,
  error: null,
};

// Create async thunk for file upload
export const fetchRecentGCodeFiles = createAsyncThunk(
  'slicer/recentGCodeFilesSlice',
  getRecentGCodeFiles,
);

export const slice = createSlice({
  name: "recentGCodeFilesSlice",
  initialState,
  reducers: { },
  extraReducers(builder) {
    builder
      .addCase(fetchRecentGCodeFiles.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchRecentGCodeFiles.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
      })
      .addCase(fetchRecentGCodeFiles.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = [];
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
