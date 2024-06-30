/**
 * uploadAndSliceSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { postUploadAndSlice } from "./_api";

// Enums
import { Status } from "enums";

// Types
// import { MeltPoolFilterset, MeltPoolRecord } from "./_types";
export interface RecordsSliceInitialState extends AsyncThunkInitialState {
  response: {
    file: string | null;
  };
}

// Constants
const initialState: RecordsSliceInitialState = {
  response: {
    file: null,
  },
  status: Status.Idle,
  error: null,
};

// Create async thunk for file upload
export const fetchUploadAndSlice = createAsyncThunk(
  'slicer/fetchUploadAndSlice',
  async (file: File) => {
    const response = await postUploadAndSlice(file);
    return response;
  },
);

export const slice = createSlice({
  name: "slicerUploadFile",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUploadAndSlice.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchUploadAndSlice.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
      })
      .addCase(fetchUploadAndSlice.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = {
          file: null,
        };
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
