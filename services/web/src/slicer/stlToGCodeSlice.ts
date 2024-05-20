/**
 * stlToGCodeSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { postSTLToGcode } from "./_api";

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

export const fetchSTLToGCode = createAsyncThunk(
  "slicer/fetchSTLToGCode",
  async () => {
    const response = await postSTLToGcode();
    return response;
  },
);

export const slice = createSlice({
  name: "slicerSTLToGCode",
  initialState,
  reducers: {
    // setRecords: (state, action) => {
    //   // Can't set `state = action.payload` directly as it won't update.
    //   state.response.count = action.payload.count;
    //   state.response.next = action.payload.next;
    //   state.response.previous = action.payload;
    //   state.response.results = action.payload.results;
    //   state.data = action.payload.results;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSTLToGCode.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchSTLToGCode.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
        // state.data = action.payload.results;
      })
      .addCase(fetchSTLToGCode.rejected, (state, action) => {
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
