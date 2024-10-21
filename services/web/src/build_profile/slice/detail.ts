/**
 * detail.ts
 * Slice file for reading, updating, deleting build profile.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import {
  deleteBuildProfile as deleteBuildProfileAPI,
  getBuildProfile,
  putBuildProfile,
} from "build_profile/_api";

// Enums
import { Status } from "enums";

// Types
import { AsyncThunkInitialState } from "types";
import {
  BuildProfileRequest,
  BuildProfileDetailResponse,
  BuildProfileDetailDeleteResponse,
  BuildProfileDetailReadResponse,
  BuildProfileDetailUpdateResponse,
} from "build_profile/_types";

interface SliceInitialState {
  read: {
    response: BuildProfileDetailReadResponse,
  } & AsyncThunkInitialState,
  update: {
    response: BuildProfileDetailUpdateResponse,
  } & AsyncThunkInitialState,
  delete: {
    response: BuildProfileDetailDeleteResponse,
  } & AsyncThunkInitialState,
  data: BuildProfileDetailResponse | null,
}

// Constants
const initialDetailResponse = {
  code: null,
  data: null,
};

const initialState: SliceInitialState = {
  read: {
    response: initialDetailResponse,
    status: Status.Idle,
    error: null,
  },
  update: {
    response: initialDetailResponse,
    status: Status.Idle,
    error: null,
  },
  delete: {
    response: initialDetailResponse,
    status: Status.Idle,
    error: null,
  },
  data: null,
};

export const readBuildProfile = createAsyncThunk(
  "buildProfileDetail/read",
  async (id: string) => {
    const response = await getBuildProfile(id);
    return response;
  },
);

export const updateBuildProfile = createAsyncThunk(
  "buildProfileDetail/update",
  async (request: BuildProfileRequest) => {
    const response = await putBuildProfile(request);
    return response;
  },
);

export const deleteBuildProfile = createAsyncThunk(
  "buildProfileDetail/delete",
  async (id: string) => {
    const response = await deleteBuildProfileAPI(id);
    return response;
  },
);

export const slice = createSlice({
  name: "buildProfileDetail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Read
      .addCase(readBuildProfile.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readBuildProfile.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload.data;
      })
      .addCase(readBuildProfile.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = initialDetailResponse;
        state.read.error = action.error.message;
      })

      // Update
      .addCase(updateBuildProfile.pending, (state) => {
        state.update.status = Status.Loading;
      })
      .addCase(updateBuildProfile.fulfilled, (state, action) => {
        state.update.status = Status.Succeeded;
        state.update.response = action.payload;
        state.data = action.payload.data;
      })
      .addCase(updateBuildProfile.rejected, (state, action) => {
        state.update.status = Status.Failed;
        state.update.response = initialDetailResponse;
        state.update.error = action.error.message;
      })

      // Delete 
      .addCase(deleteBuildProfile.pending, (state) => {
        state.delete.status = Status.Loading;
      })
      .addCase(deleteBuildProfile.fulfilled, (state, action) => {
        state.delete.status = Status.Succeeded;
        state.delete.response = action.payload;
        state.data = null;
      })
      .addCase(deleteBuildProfile.rejected, (state, action) => {
        state.delete.status = Status.Failed;
        state.delete.response = initialDetailResponse;
        state.delete.error = action.error.message;
      });
  },
});

export default slice.reducer;
