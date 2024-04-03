/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from "@reduxjs/toolkit";

// Reducers
import themeReducer from "common/themeSlice";
import specificationsReducer from "machine/specificationsSlice";
import metalsReducer from "material/metalsSlice";
import eagarTsaiSliceReducer from "melt_pool/eagarTsaiSlice";
import recordsReducer from "melt_pool/recordsSlice";
import processParametersReducer from "melt_pool/processParametersSlice";
import configurationReducer from "process_map/configurationSlice";

const store = configureStore({
  reducer: {
    // Machine
    machineSpecifications: specificationsReducer,
    // Materials
    materialMetals: metalsReducer,
    // Melt Pool
    meltPoolEagarTsai: eagarTsaiSliceReducer,
    meltPoolProcessParameters: processParametersReducer,
    meltPoolRecords: recordsReducer,
    // Process Map
    processMapConfiguration: configurationReducer,
    // Theme
    theme: themeReducer,
  },
});

// https://redux.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
