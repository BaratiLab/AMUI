/**
 * types.ts
 * Types for build profiles.
 */

import { MaterialResponse } from "material/_types";
import { MachineResponse } from "machine/_types";

export interface BuildProfileRequest {
  id?: number | null;
  title: string;
  description: string;
  material_id: number | null;
  machine_id: number | null;
}

export interface BuildProfileListResponse extends Omit<BuildProfileRequest, 'material_id' | 'machine_id'> {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  material_name?: string;
  machine_name?: string;
}

export interface BuildProfileDetailResponse extends Omit<BuildProfileListResponse, 'material_name' | 'machine_name'> {
  material: MaterialResponse;
  machine: MachineResponse;
}

export type BuildProfileListCreateResponse = null | {
  code: number;
  data: BuildProfileListResponse;
}

export type BuildProfileListReadResponse = null | {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: BuildProfileListResponse[];
  }
}

export type BuildProfileDetailReadResponse = null | {
  code: number;
  data: BuildProfileDetailResponse;
}

export type BuildProfileDetailUpdateResponse = null | {
  code: number;
  data: BuildProfileDetailResponse;
}

export type BuildProfileDetailDeleteResponse = null | {
  code: number;
  data: string;
};
