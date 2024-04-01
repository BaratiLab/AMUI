/**
 * _types.ts
 */

// Enums
import { Section } from "./_enums";

export interface ConfigurationSliceInitialState {
  // Section
  section: Section;

  // Machine
  machine_id: number | null;
  power_max: number | null;
  power_min: number | null;
  velocity_max: number | null;
  velocity_min: number | null;
  spot_size_max: number | null;
  spot_size_min: number | null;
  layer_thickness_max: number | null;
  layer_thickness_min: number | null;
}

export interface ProcessMapPoints {
  velocity: number;
  keyhole?: number | [number, number];
  desirable?: number | [number, number];
  lackOfFusion?: number | [number, number];
  power?: number;
}
