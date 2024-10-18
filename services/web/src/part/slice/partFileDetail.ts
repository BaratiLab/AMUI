/**
 * partFileDetail.ts
 * Slice file for reading part file.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getPartFile } from "part/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import { PartFile, PartFileDetailReadResponse } from "part/_types";

interface SliceInitialState {
  read: {
    response: PartFileDetailReadResponse,
  } & AsyncThunkInitialState,
  data: PartFile | null,
}

const initialState: SliceInitialState = {
  read: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  data: null,
};

export const readPartFile = createAsyncThunk(
  "partFileDetail/read",
  async (id: string) => {
    const response = await getPartFile(id);
    return response;
  },
);

export const slice = createSlice({
  name: "partFileDetail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Read
      .addCase(readPartFile.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readPartFile.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.data || null;
      })
      .addCase(readPartFile.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.read.error = action.error.message;
      })
  },
});

export default slice.reducer;
