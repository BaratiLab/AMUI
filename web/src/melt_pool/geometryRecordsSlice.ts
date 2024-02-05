/**
 * geometryRecordsSlice.ts
 * Slice file for managing state melt pool geometries route.
 */

// Node Modules
import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'meltPoolGeometryRecords',
  initialState: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  reducers: {
    setGeometryRecords: (state, action) => {
      // Can't set `state = action.payload` directly as it won't update.
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload;
      state.results = action.payload.results;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGeometryRecords } = slice.actions;

export default slice.reducer;
