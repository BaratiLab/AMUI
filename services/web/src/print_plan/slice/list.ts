/**
 * list.ts
 * Slice file for creating and listing build profiles.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getPrintPlans, postPrintPlan } from "print_plan/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  PrintPlan,
  PrintPlanResponse,
  PrintPlanListCreateResponse,
  PrintPlanListReadResponse,
} from "print_plan/_types";

interface ListSliceInitialState {
  create: {
    response: PrintPlanListCreateResponse,
  } & AsyncThunkInitialState,
  read: {
    response: PrintPlanListReadResponse,
  } & AsyncThunkInitialState,
  data: PrintPlanResponse[],
}

// Constants
const initialState: ListSliceInitialState = {
  create: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  read: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  data: [],
};

/**
 * @description Retrieves available build profiles.
 */
export const readPrintPlans = createAsyncThunk(
  "printPlanList/read",
  async () => {
    const response = await getPrintPlans();
    return response;
  },
);

export const createPrintPlan = createAsyncThunk(
  "printPlanList/create",
  async (request: PrintPlan) => {
    const response = await postPrintPlan(request)
    return response;
  }
)

export const slice = createSlice({
  name: "printPlanList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Create
      .addCase(createPrintPlan.pending, (state) => {
        state.create.status = Status.Loading;
      })
      .addCase(createPrintPlan.fulfilled, (state, action) => {
        state.create.status = Status.Succeeded;
        state.create.response = action.payload;
        if (action.payload) {
          // Should always be an object, just makes typescript happy.
          state.data = [action.payload.data, ...state.data];
        }
      })
      .addCase(createPrintPlan.rejected, (state, action) => {
        state.create.status = Status.Failed;
        state.create.response = null;
        state.create.error = action.error.message;
      })
      // Read
      .addCase(readPrintPlans.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readPrintPlans.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.data.results || [];
      })
      .addCase(readPrintPlans.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.data = [];
        state.read.error = action.error.message;
      });
  },
});

export default slice.reducer;
