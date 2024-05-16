/**
 * processParametersSlice.ts
 * Redux toolkit slice for handling process parameter data.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getProcessParameters } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { MeltPoolProcessParameters } from "./_types";
export interface ProcessParametersInitialState extends AsyncThunkInitialState {
  data: MeltPoolProcessParameters;
}

// Constants
const initialState: ProcessParametersInitialState = {
  data: {
    power_marks: [],
    velocity_marks: [],
    hatch_spacing_marks: [],
  },
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchProcessParameters = createAsyncThunk(
  "meltPool/fetchProcessParameters",
  async (material: string) => {
    const response = await getProcessParameters(material);
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolProcessParameters",
  initialState,
  reducers: {
    setProcessParameters: (state, action) => {
      const { processParameters } = action.payload;
      state.data = processParameters;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProcessParameters.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchProcessParameters.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchProcessParameters.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setProcessParameters } = slice.actions;

export default slice.reducer;
