/**
 * materialListSlice.ts
 * Slice file for managing state for materialList within materials app.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getMaterialList } from "material/_api";

// Enums
import { Status } from "enums";

// Types
import { MaterialListReadResponse, MaterialResponse } from "material/_types";
import { AsyncThunkInitialState } from "types";

interface SliceInitialState {
  read: {
    response: MaterialListReadResponse;
  } & AsyncThunkInitialState,
  data: MaterialResponse[];
}

// Constants
const initialState: SliceInitialState = {
  read: {
    response: {
      count: null,
      next: null,
      previous: null,
      results: [],
    },
    status: Status.Idle,
    error: null,
  },
  data: [],
};

/**
 * @description Retrieves available materials.
 */
export const readMaterials = createAsyncThunk(
  "materialList/read",
  async () => {
    const response = await getMaterialList();
    return response;
  },
);

export const slice = createSlice({
  name: "materialList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(readMaterials.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readMaterials.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload.results;
      })
      .addCase(readMaterials.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = {
          count: null,
          next: null,
          previous: null,
          results: [],
        };
        state.data = [];
        state.read.error = action.error.message;
      });
  },
});

export default slice.reducer;
