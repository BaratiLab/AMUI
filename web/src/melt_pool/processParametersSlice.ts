/**
 * processParametersSlice.ts
 * Redux toolkit slice for handling process parameter data.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// Node Modules
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API
import { getProcessParameters } from './_api';

// Enums
import { Status } from 'enums';

// Types
interface InitialState {
  data: {},
  status: Status,
  error: string | null | undefined
}

// Constants
const initialState: InitialState = {
  data: {},
  status: Status.Idle,
  error: null,
};

/**
 * @description Retrieves available melt pool process parameters.
 */
export const fetchProcessParameters = createAsyncThunk(
  'meltPool/fetchProcessParameters',
  async () => {
    const response = await getProcessParameters();
    return response
  }
);

/**
 * @description Slice component for handling redux logic.
 */
export const slice = createSlice({
  name: 'meltPoolProcessParameters',
  initialState,
  reducers: {
    setProcessParameters: (state, action) => {
      const { processParameters } = action.payload;
      state.data = processParameters;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProcessParameters.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchProcessParameters.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.data = action.payload; 
      })
      .addCase(fetchProcessParameters.rejected, (state, action) => {
        state.status = Status.Failed;
        state.data = {};
        state.error = action.error.message;
      })
  }
})

// Action creators are generated for each case reducer function
export const { setProcessParameters } = slice.actions;

export default slice.reducer;
