/**
 * recordsSlice.ts
 * Slice file for managing state melt pools records.
 */

// Node Modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// API
import { getRecords } from './_api';

// Enums
import { Status } from 'enums';

// Types
import { MeltPoolFilterset, RecordsSliceInitialState } from './_types';

// Constants
const initialState: RecordsSliceInitialState = {
  response: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  data: [],
  status: Status.Idle,
  error: null,
}

/**
 * @description Retrieves available melt pool records.
 */
export const fetchRecords = createAsyncThunk(
  'meltPool/fetchRecords',
  async (filterset: MeltPoolFilterset) => {
    const response = await getRecords(filterset);
    return response
  }
);

export const slice = createSlice({
  name: 'meltPoolRecords',
  initialState,
  reducers: {
    setRecords: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      state.response.count = action.payload.count;
      state.response.next = action.payload.next;
      state.response.previous = action.payload;
      state.response.results = action.payload.results;
      state.data = action.payload.results;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.response = action.payload;
        state.data = action.payload.results;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = Status.Failed;
        state.response = {
          count: null,
          next: null,
          previous: null,
          results: [],
        };
        state.data = [];
        state.error = action.error.message;
      })
  }
})

// Action creators are generated for each case reducer function
export const { setRecords } = slice.actions;

export default slice.reducer;
