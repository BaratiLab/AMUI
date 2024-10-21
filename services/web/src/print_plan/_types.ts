/**
 * types.ts
 * Types for build profiles.
 */

import { BuildProfileDetailResponse } from "build_profile/_types";
import { PartDetailResponse, PartListResponse } from "part/_types";

export interface PrintPlanRequest {
  id?: number | null;
  name: string;
  build_profile_id: number | null;
  part_id: number | null;
}

export interface PrintPlanListResponse extends Omit<PrintPlanRequest, 'build_profile_id' | 'part_id'> {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  build_profile_title?: string;
  build_profile_material_name?: string;
  part: PartListResponse | null;
}

export interface PrintPlanDetailResponse extends Omit<PrintPlanListResponse, 'build_profile_title' | 'build_profile_material_name' | 'part_name'> {
  build_profile: BuildProfileDetailResponse | null;
  part: PartDetailResponse | null;
}

export type PrintPlanListCreateResponse = null | {
  code: number;
  data: PrintPlanListResponse;
}

export type PrintPlanListReadResponse = null | {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: PrintPlanListResponse[];
  }
}

export type PrintPlanDetailReadResponse = null | {
  code: number;
  data: PrintPlanDetailResponse;
}

export type PrintPlanDetailUpdateResponse = null | {
  code: number;
  data: PrintPlanDetailResponse;
}

export type PrintPlanDetailDeleteResponse = null | {
  code: number;
  data: string;
};
