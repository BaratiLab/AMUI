/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import classificationRecordsReducer from 'melt_pool/classificationRecordsSlice';
import geometryRecordsReducer from 'melt_pool/geometryRecordsSlice';
import processParametersReducer from 'melt_pool/processParametersSlice';

const store = configureStore({
  reducer: {
    meltPoolClassificationRecords: classificationRecordsReducer,
    meltPoolGeometryRecords: geometryRecordsReducer,
    meltPoolProcessParameters: processParametersReducer,
  },
})

// https://redux.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
