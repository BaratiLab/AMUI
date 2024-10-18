/**
 * partFileList.ts
 * Slice file for creating and listing part files.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import { getPartFiles, postPartFile } from "part/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  PartFile,
  PartFileResponse,
  PartFileListCreateResponse,
  PartFileListReadResponse,
} from "part/_types";

interface ListSliceInitialState {
  create: {
    response: PartFileListCreateResponse,
  } & AsyncThunkInitialState,
  read: {
    response: PartFileListReadResponse,
  } & AsyncThunkInitialState,
  data: PartFileResponse[],
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
 * @description Retrieves available part files.
 */
export const readPartFiles = createAsyncThunk(
  "partFileList/read",
  async () => {
    const response = await getPartFiles();
    return response;
  },
);

export const createPartFile = createAsyncThunk(
  "partFileList/create",
  async (request: PartFile) => {
    const response = await postPartFile(request)
    return response;
  }
)

export const slice = createSlice({
  name: "partFileList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Create
      .addCase(createPartFile.pending, (state) => {
        state.create.status = Status.Loading;
      })
      .addCase(createPartFile.fulfilled, (state, action) => {
        state.create.status = Status.Succeeded;
        state.create.response = action.payload;
        if (action.payload) {
          // Should always be an object, just makes typescript happy.
          state.data = [action.payload.data, ...state.data];
        }
      })
      .addCase(createPartFile.rejected, (state, action) => {
        state.create.status = Status.Failed;
        state.create.response = null;
        state.create.error = action.error.message;
      })
      // Read
      .addCase(readPartFiles.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readPartFiles.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload?.data.results || [];
      })
      .addCase(readPartFiles.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = null;
        state.data = [];
        state.read.error = action.error.message;
      });
  },
});

export default slice.reducer;
