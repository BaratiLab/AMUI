/**
 * processParametersByMaterialSlice.ts
 * Redux toolkit slice for handling process parameter data.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkInitialState } from "types";

// API
import { getProcessParametersByMaterial } from "./_api";

// Enums
import { Status } from "enums";

// Types
import { MeltPoolProcessParametersByMaterial } from "./_types";
export interface ProcessParametersByMaterialInitialState
  extends AsyncThunkInitialState {
  data: MeltPoolProcessParametersByMaterial;
}

// Constants
const initialState: ProcessParametersByMaterialInitialState = {
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
export const fetchProcessParametersByMaterial = createAsyncThunk(
  "meltPool/fetchProcessParametersByMaterial",
  async (material: string) => {
    const response = await getProcessParametersByMaterial(material);
    return response;
  },
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: "meltPoolProcessParametersByMaterial",
  initialState,
  reducers: {
    setProcessParametersByMaterial: (state, action) => {
      const { processParametersByMaterial } = action.payload;
      state.data = processParametersByMaterial;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProcessParametersByMaterial.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchProcessParametersByMaterial.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload;
      })
      .addCase(fetchProcessParametersByMaterial.rejected, (state, action) => {
        state.status = Status.Failed;
        // Probably needed for immutable behavior.
        state.data = { ...initialState.data };
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setProcessParametersByMaterial } = slice.actions;

export default slice.reducer;
