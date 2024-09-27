/**
 * list.ts
 * Slice file for creating and listing build profiles.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getParts, postPart } from "part/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  Part,
  PartResponse,
  PartListCreateResponse,
  PartListReadResponse,
} from "part/_types";

interface ListSliceInitialState {
  create: {
    response: PartListCreateResponse,
  } & AsyncThunkInitialState,
  read: {
    response: PartListReadResponse,
  } & AsyncThunkInitialState,
  data: PartResponse[],
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
export const readParts = createAsyncThunk(
  "partList/read",
  async () => {
    const response = await getParts();
    return response;
  },
);

export const createPart = createAsyncThunk(
  "partList/create",
  async (request: Part) => {
    const response = await postPart(request)
    return response;
  }
)

export const slice = createSlice({
  name: "partList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Create
      .addCase(createPart.pending, (state) => {
        state.create.status = Status.Loading;
      })
      .addCase(createPart.fulfilled, (state, action) => {
        state.create.status = Status.Succeeded;
        state.create.response = action.payload;
        if (action.payload) {
          // Should always be an object, just makes typescript happy.
          state.data = [action.payload.data, ...state.data];
        }
      })
      .addCase(createPart.rejected, (state, action) => {
        state.create.status = Status.Failed;
        state.create.response = null;
        state.create.error = action.error.message;
      })
      // Read
      .addCase(readParts.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readParts.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.data.results || [];
      })
      .addCase(readParts.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.data = [];
        state.read.error = action.error.message;
      });
  },
});

export default slice.reducer;
