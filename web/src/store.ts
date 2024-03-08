/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import specificationsReducer from 'machine/specificationsSlice';
import recordsReducer from 'melt_pool/recordsSlice';
import processParametersReducer from 'melt_pool/processParametersSlice';
import themeReducer from 'common/themeSlice';

const store = configureStore({
  reducer: {
    machineSpecifications: specificationsReducer,
    meltPoolProcessParameters: processParametersReducer,
    meltPoolRecords: recordsReducer,
    theme: themeReducer,
  },
})

// https://redux.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
