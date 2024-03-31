/**
 * _types.ts
 * Types within melt pool app.
 */

// Types
import { AsyncThunkInitialState } from "types";

// Request
export interface MeltPoolFilterset {
  material?: "" | HTMLSelectElement;
  process?: "" | HTMLSelectElement;
  power?: number;
  velocity?: number;
  hatch_spacing?: number;
}

// Initial State
export interface RecordsSliceInitialState extends AsyncThunkInitialState {
  data: [];
  response: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: MeltPoolRecord[];
  };
}

export interface ProcessParametersInitialState extends AsyncThunkInitialState {
  data: MeltPoolProcessParameters;
}

// Response
export interface MeltPoolProcessParameters {
  material: string[];
  process: string[];
  power: number[];
  velocity: number[];
  hatch_spacing: number[];
}

export interface MeltPoolRecord {
  material: string;
  process: string;
  power: number;
  velocity: number;
  hatch_spacing: number;
  energy_density: number | null;
  layer_thickness: number;
  beam_diameter: number;
  density: number;
  specific_heat_capacity: number;
  k: number;
  melting_temperature: number;
  absorption_coefficient: number;
  minimal_absorptivity: number;
  melt_pool_shape: string;
  spatter: boolean | null; // Updated to boolean
  weight_percent_Zn: number;
  weight_percent_Mg: number;
  weight_percent_Si: number;
  weight_percent_Al: number;
  weight_percent_Sn: number;
  weight_percent_Zr: number;
  weight_percent_W: number;
  weight_percent_Ti: number;
  weight_percent_V: number;
  weight_percent_Co: number;
  weight_percent_Cu: number;
  weight_percent_Ta: number;
  weight_percent_Nb: number;
  weight_percent_Ni: number;
  weight_percent_Cr: number;
  weight_percent_Fe: number;
  weight_percent_Mn: number;
  weight_percent_Mo: number;
  weight_percent_Y: number;
  sub_process: string;
  melt_pool_depth: number;
  melt_pool_width: number;
  melt_pool_length: number;
  depth_over_length: number;
  depth_over_width: number;
  length_over_width: number;
  energy_joules_over_mm: number;
  energy_joules_over_mm_cubed: number;
  absorption_coefficient_2: number;
  D10: number | null;
  D50: number | null;
  D90: number | null;
  paper_id: string;
  paper_url: string;
  porosity: number | null;
  relative_density: number | null;
  record_type: string;
  comments: string | null;
  unknown: number;
}
