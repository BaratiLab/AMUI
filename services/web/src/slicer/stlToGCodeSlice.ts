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

export const fetchSTLToGCode = createAsyncThunk(
  "slicer/fetchSTLToGCode",
  async (file: string) => {
    const response = await postSTLToGcode(file);
    return response;
  },
);

export const slice = createSlice({
  name: "slicerSTLToGCode",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSTLToGCode.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchSTLToGCode.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
      })
      .addCase(fetchSTLToGCode.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = {
          file: null
        };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { setRecords } = slice.actions;

export default slice.reducer;
