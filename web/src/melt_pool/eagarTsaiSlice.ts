/**
 * eagarTsaiSlice.ts
 * Redux toolkit slice for handling Eagar-Tsai melt pool approximation request.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getEagarTsai } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { MeltPoolRecord } from "./_types";
export interface EagarTsaiInitialState extends AsyncThunkInitialState {
  data: {
    depths: number[][];
    lengths: number[][];
    widths: number[][];
    powers: number[];
    velocities: number[];
  };
  response: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: MeltPoolRecord[];
  };
}

// Constants
const initialState: EagarTsaiInitialState = {
  response: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
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
export const fetchEagarTsai = createAsyncThunk(
  "meltPool/fetchEagarTsai",
  async () => {
    const response = await getEagarTsai();
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolEagarTsai",
  initialState,
  reducers: {
    setEagarTsai: (state, action) => {
      const { eagarTsai } = action.payload;
      state.data = eagarTsai;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEagarTsai.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchEagarTsai.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchEagarTsai.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setEagarTsai } = slice.actions;

export default slice.reducer;
