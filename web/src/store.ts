/**
 * store.ts
 * Redux store component.
 */

// Node Modules
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import meltPoolClassificationRecordsReducer from 'melt_pool/classificationRecordsSlice';

const store = configureStore({
  reducer: {
    meltPoolClassificationRecords: meltPoolClassificationRecordsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
