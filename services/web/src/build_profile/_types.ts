/**
 * types.ts
 * Types for build profiles.
 */

import { MaterialResponse } from "material/_types";
import { MachineResponse } from "machine/_types";

export interface BuildProfileRequest {
  id?: number | null;
  name: string;
  material_id: number | null;
  machine_id: number | null;
  layer_thickness: number;
  hatch_spacing: number;
  power: number;
  velocity: number;
}

export interface BuildProfileResponse {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  id: number;
  name: string;
  layer_thickness: number;
  hatch_spacing: number;
  power: number;
  velocity: number;
}

export interface BuildProfileListResponse extends BuildProfileResponse {
  material_name?: string;
  machine_name?: string;
}

export interface BuildProfileDetailResponse extends BuildProfileResponse {
  material: MaterialResponse;
  machine: MachineResponse;
}

export type BuildProfileListCreateResponse = {
  code: number;
  data: BuildProfileListResponse;
}

export type BuildProfileListReadResponse = {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: BuildProfileListResponse[];
  }
}

export type BuildProfileDetailReadResponse = {
  code: number | null;
  data: BuildProfileDetailResponse | null;
}

export type BuildProfileDetailUpdateResponse = {
  code: number | null;
  data: BuildProfileDetailResponse | null;
}

export type BuildProfileDetailDeleteResponse = {
  code: number | null;
  data: string | null;
};
