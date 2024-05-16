/**
 * simulationSlice.ts
 * Redux toolkit slice for handling MeltpoolNet process parameter simulation.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getSimulation } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { SurrogateSimulationParameters } from "./_types";

export interface SimulationInitialState extends AsyncThunkInitialState {
  data: {
    prediction: number[][];
  };
}

// Constants
const initialState: SimulationInitialState = {
  data: {
    prediction: [],
  },
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchSimulation = createAsyncThunk(
  "meltPool/fetchSimulation",
  async (simulationParameters: SurrogateSimulationParameters) => {
    const response = await getSimulation(simulationParameters);
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "surrogateSimulation",
  initialState,
  reducers: {
    setSimulation: (state, action) => {
      const { simulation } = action.payload;
      state.data = simulation;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSimulation.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchSimulation.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchSimulation.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setSimulation } = slice.actions;

export default slice.reducer;
