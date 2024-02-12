/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import classificationRecordsReducer from 'melt_pool/classificationRecordsSlice';
import geometryRecordsReducer from 'melt_pool/geometryRecordsSlice';

const store = configureStore({
  reducer: {
    meltPoolClassificationRecords: classificationRecordsReducer,
    meltPoolGeometryRecords: geometryRecordsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
