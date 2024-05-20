/**
 * uploadFileSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
// import { postUploadFile } from "./_api";

const csrfToken = localStorage.getItem('csrfToken');

// Enums
import { Status } from "enums";

// Types
// import { MeltPoolFilterset, MeltPoolRecord } from "./_types";
export interface RecordsSliceInitialState extends AsyncThunkInitialState {
  // data: [];
  response: {
    // count: null | number;
    // next: null | string;
    // previous: null | string;
    // results: MeltPoolRecord[];
  };
}

// Constants
const initialState: RecordsSliceInitialState = {
  response: {
    // count: null,
    // next: null,
    // previous: null,
    // results: [],
  },
  // data: [],
  status: Status.Idle,
  error: null,
};

// Create async thunk for file upload
export const fetchUploadFile = createAsyncThunk(
  'slicer/fetchUploadFile',
  async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/slicer/upload_file/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken,
      },
    });

    return response.data;
  }
);

export const slice = createSlice({
  name: "slicerUploadFile",
  initialState,
  reducers: { },
  extraReducers(builder) {
    builder
      .addCase(fetchUploadFile.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchUploadFile.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
        // state.data = action.payload.results;
      })
      .addCase(fetchUploadFile.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = {
          // count: null,
          // next: null,
          // previous: null,
          // results: [],
        };
        // state.data = [];
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { setRecords } = slice.actions;

export default slice.reducer;
