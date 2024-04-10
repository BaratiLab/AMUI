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
  power_max: number;
  power_min: number;
  velocity_max: number;
  velocity_min: number;
  spot_size_max: number | null;
  spot_size_min: number | null;
  layer_thickness_max: number | null;
  layer_thickness_min: number | null;

  // Process Map
  hatchSpacing: number;
  layerThickness: number;
}

export interface ProcessMapPoints {
  velocity: number;
  keyhole?: number | [number, number];
  desirable?: number | [number, number];
  lackOfFusion?: number | [number, number];
  power?: number;
}
