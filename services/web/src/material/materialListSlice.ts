/**
 * materialListSlice.ts
 * Slice file for managing state for materialList within materials app.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getMaterialList } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { MaterialListSliceInitialState } from "./_types";

// Constants
const initialState: MaterialListSliceInitialState = {
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
 * @description Retrieves available materials.
 */
export const fetchMaterialList = createAsyncThunk(
  "material/fetchMaterialList",
  async () => {
    const response = await getMaterialList();
    return response;
  },
);

export const slice = createSlice({
  name: "materialMaterialList",
  initialState,
  reducers: {
    setMaterialList: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      state.response.count = action.payload.count;
      state.response.next = action.payload.next;
      state.response.previous = action.payload;
      state.response.results = action.payload.results;
      state.data = action.payload.results;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMaterialList.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchMaterialList.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
        state.data = action.payload.results;
      })
      .addCase(fetchMaterialList.rejected, (state, action) => {
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

// Action creators are generated for each case reducer function
export const { setMaterialList } = slice.actions;

export default slice.reducer;
