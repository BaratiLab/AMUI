/**
 * flow3dSlice.ts
 * Redux toolkit slice for handling flow3d melt pool approximation request.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getFlow3D } from "./_api";

// Enums
import { Status } from "enums";

// Types
export interface Flow3DInitialState extends AsyncThunkInitialState {
  data: {
    depths: number[][];
    lengths: number[][];
    widths: number[][];
    powers: number[];
    velocities: number[];
  };
}

// Constants
const initialState: Flow3DInitialState = {
  data: {
    depths: [[]],
    lengths: [[]],
    widths: [[]],
    powers: [],
    velocities: [],
  },
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchFlow3D = createAsyncThunk(
  "meltPool/fetchFlow3D",
  async () => {
    const response = await getFlow3D();
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolFlow3D",
  initialState,
  reducers: {
    setFlow3D: (state, action) => {
      const { flow3d } = action.payload;
      state.data = flow3d;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFlow3D.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchFlow3D.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchFlow3D.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setFlow3D } = slice.actions;

export default slice.reducer;
