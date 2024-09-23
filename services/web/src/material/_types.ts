/**
 * _types.ts
 * Types within machine app.
 */

// Types
import { AsyncThunkInitialState } from "types";

// Initial State
export interface MaterialListSliceInitialState
  extends AsyncThunkInitialState {
  data: Material[];
  response: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: Material[];
  };
}

// Response
export interface Material {
  id: number;
  name: string;
  flow_3d_name: string;
  uns_id: string;
  density_g_cm_3?: number | null;
  specific_heat_erg_g_K?: number | null;
  thermal_conductivity_erg_cm_s_K?: number | null;
  viscosity_g_cm_s?: number | null;
  solidus_temperature_K?: number | null;
  liquidus_temperature_K?: number | null;
}
