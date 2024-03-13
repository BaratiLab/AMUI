/**
 * configurationSlice.ts
 * Redux toolkit slice for managing process map configuration.
 */

// Node Modules
import { createSlice } from '@reduxjs/toolkit';

// Enums
import { Section } from './_enums';

// Types
import { ConfigurationSliceInitialState } from './_types';

// Constants
const initialState: ConfigurationSliceInitialState = {
  // Section
  section: Section.Machine,

  // Machine
  machine_id: null,
  power_max: null,
  power_min: null,
  velocity_max: null,
  velocity_min: null,
  spot_size_max: null,
  spot_size_min: null,
  layer_thickness_max: null,
  layer_thickness_min: null,
};

/**
 * @description Slice for handling process map configuration redux logic.
 */
export const slice = createSlice({
  name: 'processMapConfiguration',
  initialState,
  reducers: {
    setProcessMapConfiguration: (state, action) => {
      state = action.payload;
    },
    setProcessMapConfigurationMachine: (state, action) => {
      state.machine_id = action.payload.machine_id;
      state.power_max = action.payload.power_max;
      state.power_min = action.payload.power_min;
      state.velocity_max = action.payload.velocity_max;
      state.velocity_min = action.payload.velocity_min;
      state.spot_size_max = action.payload.spot_size_max;
      state.spot_size_min = action.payload.spot_size_min;
      state.layer_thickness_max = action.payload.layer_thickness_max;
      state.layer_thickness_min = action.payload.layer_thickness_min;
    },
    setProcessMapConfigurationSection: (state, action) => {
      state.section = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setProcessMapConfiguration,
  setProcessMapConfigurationSection,
  setProcessMapConfigurationMachine,
} = slice.actions;

export default slice.reducer;
