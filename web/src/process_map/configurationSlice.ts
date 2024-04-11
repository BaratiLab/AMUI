/**
 * configurationSlice.ts
 * Redux toolkit slice for managing process map configuration.
 */

// Node Modules
import { createSlice } from "@reduxjs/toolkit";

// Enums
import { Section } from "./_enums";

// Types
import { ConfigurationSliceInitialState } from "./_types";

// Constants
const initialState: ConfigurationSliceInitialState = {
  // Section
  // section: Section.Machine,
  section: Section.ProcessMap,

  // Machine
  // TODO: Deprecate
  machine_id: null,
  power_max: 0,
  power_min: 0,
  velocity_max: 0,
  velocity_min: 0,
  spot_size_max: null,
  spot_size_min: null,
  layer_thickness_max: null,
  layer_thickness_min: null,

  // Process Map
  hatchSpacing: 25, // In microns
  layerThickness: 25, // in microns

  nominalProcessParameters: [],
};

/**
 * @description Slice for handling process map configuration redux logic.
 */
export const slice = createSlice({
  name: "processMapConfiguration",
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
    },
    setProcessMapHatchSpacing: (state, action) => {
      state.hatchSpacing = action.payload;
    },
    setProcessMapLayerThickness: (state, action) => {
      state.layerThickness = action.payload;
    },
    setProcessMapNominalProcessParameters: (state, action) => {
      state.nominalProcessParameters = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setProcessMapConfiguration,
  setProcessMapConfigurationSection,
  setProcessMapConfigurationMachine,
  setProcessMapHatchSpacing,
  setProcessMapLayerThickness,
  setProcessMapNominalProcessParameters,
} = slice.actions;

export default slice.reducer;
