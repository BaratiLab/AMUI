/**
 * inferenceSlice.ts
 * Redux toolkit slice for handling MeltpoolNet process parameter inference.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getInference } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { MeltPoolInferenceProcessParameters } from "./_types";
export interface InferenceInitialState extends AsyncThunkInitialState {
  data: number[][];
}

// Constants
const initialState: InferenceInitialState = {
  data: [],
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchInference = createAsyncThunk(
  "meltPool/fetchInference",
  async (processParameters: MeltPoolInferenceProcessParameters) => {
    const response = await getInference(processParameters);
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolInference",
  initialState,
  reducers: {
    setInference: (state, action) => {
      const { inference } = action.payload;
      state.data = inference;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInference.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchInference.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchInference.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setInference } = slice.actions;

export default slice.reducer;
