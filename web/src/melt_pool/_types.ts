/**
 * _types.ts
 * Types within melt pool app.
 */

// Types
import { AsyncThunkInitialState } from 'types';

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
  data: [],
  response: {
    count: null | number,
    next: null | string,
    previous: null | string,
    results: MeltPoolRecord[] 
  }
}

export interface ProcessParametersInitialState extends AsyncThunkInitialState {
  data: MeltPoolProcessParameters,
}

// Response
export interface MeltPoolProcessParameters {
  material: string[],
  process: string[],
  power: number[],
  velocity: number[],
  hatch_spacing: number[],
}

export interface MeltPoolRecord {
  // TODO #78: Fill in exact type.

  // Example Response:

  // material "TiC/Inconel 718"
  // process	"PBF"
  // power	100
  // velocity	100
  // hatch_spacing	50
  // energy_density	null
  // layer_thickness	50
  // beam_diameter	70
  // density	7377.5
  // specific_heat_capacity	407.25
  // k	13.25
  // melting_temperature	2015
  // absorption_coefficient	0.9391931677
  // minimal_absorptivity	0.178
  // melt_pool_shape	"LOF"
  // spatter	null
  // weight_percent_Zn	0
  // weight_percent_Mg	0
  // weight_percent_Si	0
  // weight_percent_Al	0.3
  // weight_percent_Sn	0
  // weight_percent_Zr	0
  // weight_percent_W	0
  // weight_percent_Ti	0.9
  // weight_percent_V	0
  // weight_percent_Co	0
  // weight_percent_Cu	0
  // weight_percent_Ta	0
  // weight_percent_Nb	5.1
  // weight_percent_Ni	52
  // weight_percent_Cr	18.4
  // weight_percent_Fe	17.7
  // weight_percent_Mn	0
  // weight_percent_Mo	4.2
  // weight_percent_Y	0
  // sub_process	"SLM"
  // melt_pool_depth	53
  // melt_pool_width	80
  // melt_pool_length	90
  // depth_over_length	1.06
  // depth_over_width	0.6625
  // length_over_width	1.125
  // energy_joules_over_mm	1
  // energy_joules_over_mm_cubed	400
  // absorption_coefficient_2	0.08355273314
  // D10	null
  // D50	null
  // D90	null
  // paper_id	"7"
  // paper_url	"https://www.sciencedirect.com/science/article/abs/pii/S0030399215307350"
  // porosity	null
  // relative_density	null
  // record_type	"geometry"
  // comments	null
  // unknown	1742 
}