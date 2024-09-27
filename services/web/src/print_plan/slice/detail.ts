/**
 * detail.ts
 * Slice file for reading, updating, deleting build profile.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import {
  deletePrintPlan as deletePrintPlanAPI,
  getPrintPlan,
  putPrintPlan,
} from "print_plan/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  PrintPlanRequest,
  PrintPlanDetailDeleteResponse,
  PrintPlanDetailReadResponse,
  PrintPlanDetailUpdateResponse,
} from "print_plan/_types";

interface SliceInitialState {
  read: {
    response: PrintPlanDetailReadResponse,
  } & AsyncThunkInitialState,
  update: {
    response: PrintPlanDetailUpdateResponse,
  } & AsyncThunkInitialState,
  delete: {
    response: PrintPlanDetailDeleteResponse,
  } & AsyncThunkInitialState,
  data: PrintPlanRequest | null,
}

const initialState: SliceInitialState = {
  read: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  update: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  delete: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  data: null,
};

export const readPrintPlan = createAsyncThunk(
  "printPlanDetail/read",
  async (id: string) => {
    const response = await getPrintPlan(id);
    return response;
  },
);

export const updatePrintPlan = createAsyncThunk(
  "printPlanDetail/update",
  async (request: PrintPlanRequest) => {
    const response = await putPrintPlan(request);
    return response;
  },
);

export const deletePrintPlan = createAsyncThunk(
  "printPlanDetail/delete",
  async (id: string) => {
    const response = await deletePrintPlanAPI(id);
    return response;
  },
);

export const slice = createSlice({
  name: "printPlanDetail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Read
      .addCase(readPrintPlan.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readPrintPlan.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;

        if (action.payload) {
          state.data = {
            ...action.payload.data,
            build_profile_id: action.payload.data.build_profile?.id || null,
            part_id: action.payload.data.part?.id || null,
          }
        } else {
          state.data =  null;
        }

      })
      .addCase(readPrintPlan.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.read.error = action.error.message;
      })

      // Update
      .addCase(updatePrintPlan.pending, (state) => {
        state.update.status = Status.Loading;
      })
      .addCase(updatePrintPlan.fulfilled, (state, action) => {
        state.update.status = Status.Succeeded;
        state.update.response = action.payload;

        if (action.payload) {
          state.data = {
            ...action.payload.data,
            build_profile_id: action.payload.data.build_profile?.id || null,
            part_id: action.payload.data.part?.id || null,
          }
        } else {
          state.data =  null;
        }

      })
      .addCase(updatePrintPlan.rejected, (state, action) => {
        state.update.status = Status.Failed;
        state.update.response = null;
        state.update.error = action.error.message;
      })

      // Delete 
      .addCase(deletePrintPlan.pending, (state) => {
        state.delete.status = Status.Loading;
      })
      .addCase(deletePrintPlan.fulfilled, (state, action) => {
        state.delete.status = Status.Succeeded;
        state.delete.response = action.payload;
        state.data = null;
      })
      .addCase(deletePrintPlan.rejected, (state, action) => {
        state.delete.status = Status.Failed;
        state.delete.response = null;
        state.delete.error = action.error.message;
      });
  },
});

export default slice.reducer;
