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
  data: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  status: Status.Idle,
  error: null,
}

/**
 * @description Retrieves available melt pool records.
 */
export const fetchRecords = createAsyncThunk(
  'meltPool/fetchRecords',
  async (filterset: MeltPoolFilterset) => {
    const response = await getRecords(filterset)
    return response.data
  }
);

export const slice = createSlice({
  name: 'meltPoolRecords',
  initialState,
  reducers: {
    setRecords: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      state.data.count = action.payload.count;
      state.data.next = action.payload.next;
      state.data.previous = action.payload;
      state.data.results = action.payload.results;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRecords.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload.data; 
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = Status.Failed;
        state.data = {
          count: null,
          next: null,
          previous: null,
          results: [],
        };
        state.error = action.error.message;
      })
  }
})

// Action creators are generated for each case reducer function
export const { setRecords } = slice.actions;

export default slice.reducer;
