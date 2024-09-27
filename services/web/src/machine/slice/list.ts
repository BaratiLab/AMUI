/**
 * list.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getMachines } from "machine/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import { MachineListReadResponse, MachineResponse } from "machine/_types";
interface ListSliceInitialState {
  read: {
    response: MachineListReadResponse,
  } & AsyncThunkInitialState,
  data: MachineResponse[],
}

// Constants
const initialState: ListSliceInitialState = {
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
 * @description Retrieves available machine specifications.
 */
export const readMachines = createAsyncThunk(
  "machineList/read",
  async () => {
    const response = await getMachines();
    return response;
  },
);

export const slice = createSlice({
  name: "machineList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Read
      .addCase(readMachines.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readMachines.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.results || [];
      })
      .addCase(readMachines.rejected, (state, action) => {
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
