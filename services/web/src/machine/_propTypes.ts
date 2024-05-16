/**
 * _propTypes.ts
 * Commonly reused prop types.
 */

// Node Modules
import { number, shape, string } from "prop-types";

export const machineSpecificationPropType = shape({
  id: number.isRequired,
  machine: string.isRequired,
  company: string.isRequired,
  power_max_w: number,
  power_min_w: number,
  velocity_max_m_per_s: number,
  velocity_min_m_per_s: number,
  spot_size_min_microns: number,
  spot_size_max_microns: number,
  laser_type: string.isRequired,
  layer_thickness_min_microns: number,
  layer_thickness_max_microns: number,
  tds_link: string.isRequired,
  image_link: string.isRequired,
  company_logo_link: string.isRequired,
});
