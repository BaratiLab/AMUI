/**
 * detail.ts
 * Slice file for reading, updating, deleting build profile.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import {
  deletePart as deletePartAPI,
  getPart,
  putPart,
} from "part/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  Part,
  PartDetailResponse,
  PartDetailDeleteResponse,
  PartDetailReadResponse,
  PartDetailUpdateResponse,
} from "part/_types";

interface SliceInitialState {
  read: {
    response: PartDetailReadResponse,
  } & AsyncThunkInitialState,
  update: {
    response: PartDetailUpdateResponse,
  } & AsyncThunkInitialState,
  delete: {
    response: PartDetailDeleteResponse,
  } & AsyncThunkInitialState,
  data: PartDetailResponse | null,
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

export const readPart = createAsyncThunk(
  "partDetail/read",
  async (id: string) => {
    const response = await getPart(id);
    return response;
  },
);

export const updatePart = createAsyncThunk(
  "partDetail/update",
  async (request: Part) => {
    const response = await putPart(request);
    return response;
  },
);

export const deletePart = createAsyncThunk(
  "partDetail/delete",
  async (id: string) => {
    const response = await deletePartAPI(id);
    return response;
  },
);

export const slice = createSlice({
  name: "partDetail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Read
      .addCase(readPart.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readPart.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.data || null;
      })
      .addCase(readPart.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.read.error = action.error.message;
      })

      // Update
      .addCase(updatePart.pending, (state) => {
        state.update.status = Status.Loading;
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.update.status = Status.Succeeded;
        state.update.response = action.payload;
        state.data = action.payload?.data || null;
      })
      .addCase(updatePart.rejected, (state, action) => {
        state.update.status = Status.Failed;
        state.update.response = null;
        state.update.error = action.error.message;
      })

      // Delete 
      .addCase(deletePart.pending, (state) => {
        state.delete.status = Status.Loading;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.delete.status = Status.Succeeded;
        state.delete.response = action.payload;
        state.data = null;
      })
      .addCase(deletePart.rejected, (state, action) => {
        state.delete.status = Status.Failed;
        state.delete.response = null;
        state.delete.error = action.error.message;
      });
  },
});

export default slice.reducer;
