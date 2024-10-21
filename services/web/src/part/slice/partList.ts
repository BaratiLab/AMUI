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
  PartListResponse,
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
  data: PartListResponse[],
  record: {
    // Numeric Id values get converted to strings automatically
    [key: string]: PartListResponse
  }
}

// Constants
const initialResponse = {
  code: null,
  data: {
    count: null,
    next: null,
    previous: null,
    results: [],
  }
};

const initialState: ListSliceInitialState = {
  create: {
    response: null,
    status: Status.Idle,
    error: null,
  },
  read: {
    response: initialResponse,
    status: Status.Idle,
    error: null,
  },
  data: [],
  record: {},
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
          const partListResponse = action.payload.data
          state.data = [partListResponse, ...state.data];
          state.record = {
            ...state.record,
            [partListResponse.id]: partListResponse,
          };
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

        const readResponse = action.payload.data;
        state.data = readResponse.results;
        state.record = readResponse.results
          .reduce(
            (
              acc: { [key: string]: PartListResponse},
              item: PartListResponse
            ) => {
              acc[item.id] = item;
              return acc;
            },
            {}
          );
      })
      .addCase(readParts.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = initialResponse;
        state.data = [];
        state.read.error = action.error.message;
      });
  },
});

export default slice.reducer;
