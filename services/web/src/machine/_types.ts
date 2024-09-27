/**
 * _types.ts
 * Types within machine app.
 */

export interface MachineResponse {
  id: number;
  name: string;
  company: string;
  power_max_w?: number | null;
  power_min_w?: number | null;
  velocity_max_m_per_s?: number | null;
  velocity_min_m_per_s?: number | null;
  spot_size_min_microns?: number | null;
  spot_size_max_microns?: number | null;
  laser_type: string;
  layer_thickness_min_microns?: number | null;
  layer_thickness_max_microns?: number | null;
  tds_link: string;
  image_link: string;
  company_logo_link: string;
}

export type MachineListReadResponse = null | {
  count: null | number;
  next: null | string;
  previous: null | string;
  results: MachineResponse[];
}
