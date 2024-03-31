/**
 * eagarTsaiSlice.ts
 * Redux toolkit slice for handling Eagar-Tsai melt pool approximation request.
 * https://redux.js.org/tutorials/essentials/part-5-async-logic
 */

// // Node Modules
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // API
// import { getProcessParameters } from './_api';

// // Enums
// import { Status } from 'enums';

// // Types
// import { ProcessParametersInitialState } from './_types';

// // Constants
// const initialState: ProcessParametersInitialState = {
//   data: {
//     material: [],
//     process: [],
//     power: [],
//     velocity: [],
//     hatch_spacing: [],
//   },
//   status: Status.Idle,
//   error: null,
// };

// /**
//  * @description Retrieves available melt pool process parameters.
//  */
// export const fetchEagarTsai = createAsyncThunk(
//   'meltPool/fetchProcessParameters',
//   async () => {
//     const response = await getProcessParameters();
//     return response
//   }
// );

// /**
//  * @description Slice component for handling redux logic.
//  */
// export const slice = createSlice({
//   name: 'meltPoolProcessParameters',
//   initialState,
//   reducers: {
//     setProcessParameters: (state, action) => {
//       const { processParameters } = action.payload;
//       state.data = processParameters;
//     }
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchProcessParameters.pending, (state) => {
//         state.status = Status.Loading;
//       })
//       .addCase(fetchProcessParameters.fulfilled, (state, action) => {
//         state.status = Status.Succeeded;
//         state.data = action.payload;
//       })
//       .addCase(fetchProcessParameters.rejected, (state, action) => {
//         state.status = Status.Failed;
//         // Probably needed for immutable behavior.
//         state.data = { ...initialState.data };
//         state.error = action.error.message;
//       })
//   }
// })

// // Action creators are generated for each case reducer function
// export const { setProcessParameters } = slice.actions;

// export default slice.reducer;
