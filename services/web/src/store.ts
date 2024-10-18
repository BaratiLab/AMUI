/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from "@reduxjs/toolkit";

// Reducers
import buildProfileDetailReducer from 'build_profile/slice/detail';
import buildProfileListReducer from 'build_profile/slice/list';
import machineListReducer from "machine/slice/list";
import materialListReducer from "material/slice/list";
import partDetailReducer from 'part/slice/partDetail';
import partListReducer from 'part/slice/partList';
import partFileListReducer from 'part/slice/partFileList';
import printPlanDetailReducer from 'print_plan/slice/detail';
import printPlanListReducer from 'print_plan/slice/list';
import themeReducer from "common/themeSlice";

// Legacy
import metalsReducer from "material/metalsSlice";
import eagarTsaiSliceReducer from "melt_pool/eagarTsaiSlice";
import inferenceSliceReducer from "melt_pool/inferenceSlice";
import processParametersReducer from "melt_pool/processParametersSlice";
import recordsReducer from "melt_pool/recordsSlice";
import dimensionsReducer from "melt_pool/slice/dimensions";
import simulationSliceReducer from "surrogate/simulationSlice";
import recentGCodeFilesSliceReducer from "slicer/recentGCodeFilesSlice";
import stlToGCodeReducer from "slicer/stlToGCodeSlice";
import uploadFileReducer from "slicer/uploadFileSlice";
import uploadAndSliceReducer from "slicer/uploadAndSliceSlice";
import configurationReducer from "process_map/configurationSlice";

const store = configureStore({
  reducer: {
    // Build Profile
    buildProfileDetail: buildProfileDetailReducer,
    buildProfileList: buildProfileListReducer,
    // Machine
    machineList: machineListReducer,
    // Materials
    materialList: materialListReducer,
    // Part
    partDetail: partDetailReducer,
    partList: partListReducer,
    partFileList: partFileListReducer,
    // Print Plan
    printPlanDetail: printPlanDetailReducer,
    printPlanList: printPlanListReducer,
    // Theme
    theme: themeReducer,

    // Legacy
    // Materials
    materialMetals: metalsReducer,
    // Melt Pool
    meltPoolEagarTsai: eagarTsaiSliceReducer,
    meltPoolInference: inferenceSliceReducer,
    meltPoolProcessParameters: processParametersReducer,
    meltPoolRecords: recordsReducer,
    meltPoolDimensions: dimensionsReducer,
    // Process Map
    processMapConfiguration: configurationReducer,
    // Slicer
    recentGCodeFiles: recentGCodeFilesSliceReducer,
    slicerSTLToGCode: stlToGCodeReducer,
    slicerUploadAndSlice: uploadAndSliceReducer,
    slicerUploadFile: uploadFileReducer,
    // Surrogate
    surrogate: simulationSliceReducer,
  },
});

// https://redux.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
