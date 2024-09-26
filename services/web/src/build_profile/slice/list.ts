/**
 * list.ts
 * Slice file for creating and listing build profiles.
 */

// Node Modules
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// API
import {
  getBuildProfiles,
  postBuildProfile,
} from "build_profile/_api";

// Enums
import { Status } from "enums";

// Types
import { ListSliceInitialState } from "build_profile/_types";

// Constants
const initialState: ListSliceInitialState = {
  create: {
    response: {},
    data: null,
    status: Status.Idle,
    error: null,
  },
  read: {
    response: {
      count: null,
      next: null,
      previous: null,
      results: [],
    },
    data: [],
    status: Status.Idle,
    error: null,
  },
  data: [],
};

/**
 * @description Retrieves available build profiles.
 */
export const readBuildProfiles = createAsyncThunk(
  "buildProfileList/read",
  async () => {
    const response = await getBuildProfiles();
    return response;
  },
);

export const createBuildProfile = createAsyncThunk(
  "buildProfileList/create",
  async (request) => {
    const response = await postBuildProfile(request)
    return response;
  }
)

export const slice = createSlice({
  name: "buildProfileList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createBuildProfile.pending, (state) => {
        state.create.status = Status.Loading;
      })
      .addCase(createBuildProfile.fulfilled, (state, action) => {
        state.create.status = Status.Succeeded;
        state.create.response = action.payload;
        // state.data= [action.payload.resu..];
      })
      .addCase(createBuildProfile.rejected, (state, action) => {
        state.read.status = Status.Failed;
        state.read.response = { };
        state.data = [];
        state.read.error = action.error.message;
      })
      .addCase(readBuildProfiles.pending, (state) => {
        state.read.status = Status.Loading;
      })
      .addCase(readBuildProfiles.fulfilled, (state, action) => {
        state.read.status = Status.Succeeded;
        state.read.response = action.payload;
        state.data = action.payload.results;
      })
      .addCase(readBuildProfiles.rejected, (state, action) => {
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
