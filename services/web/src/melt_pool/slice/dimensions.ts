/**
 * dimensionsSlice.ts
 * Redux toolkit slice for handling Eagar-Tsai melt pool approximation request.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getDimensions } from "melt_pool/_api";

// Enums
import { Status } from "enums";

// Types
import { MeltPoolDimension } from "melt_pool/_types";
export interface DimensionsInitialState extends AsyncThunkInitialState {
  data: {
    dimensions: MeltPoolDimension[];
    powers: number[];
    velocities: number[];
    depths_std: number[];
    widths_std: number[];
    lengths_std: number[];
  };
  domains: [number, number][];
}

// Constants
const initialState: DimensionsInitialState = {
  data: {
    dimensions: [],
    powers: [],
    velocities: [],
    depths_std: [],
    widths_std: [],
    lengths_std: [],
  },
  domains: [[0, 1], [0, 1], [0, 1]],
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchDimensions = createAsyncThunk(
  "meltPool/fetchDimensions",
  // async (material: string) => {
  async () => {
    // const response = await getDimensions(material);
    const response = await getDimensions();
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolDimensions",
  initialState,
  reducers: {
    setDimensions: (state, action) => {
      const { dimensions } = action.payload;
      state.data = dimensions;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDimensions.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchDimensions.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
        state.domains = [
          [
            Math.min.apply(Math, action.payload.velocities),
            Math.max.apply(Math, action.payload.velocities),
          ],
          [
            Math.min.apply(Math, action.payload.powers),
            Math.max.apply(Math, action.payload.powers),
          ],
          [
            0,
            Math.max.apply(Math,[
              ...action.payload.depths_std,
              ...action.payload.lengths_std,
              ...action.payload.widths_std,
            ])
          ]
        ]
      })
      .addCase(fetchDimensions.rejected, (state, action) => {
        state.status = Status.Failed;
        state.data = initialState.data;
        state.domains = initialState.domains;
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setDimensions } = slice.actions;

export default slice.reducer;
