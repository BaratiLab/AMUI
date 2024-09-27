/**
 * types.ts
 * Types for build profiles.
 */

import { BuildProfileResponse } from "build_profile/_types";
import { PartResponse } from "part/_types";

export interface PrintPlanRequest {
  id?: number | null;
  name: string;
  build_profile_id: number | null;
  part_id: number | null;
}

export interface PrintPlanResponse extends Omit<PrintPlanRequest, 'build_profile_id' | 'part_id'> {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  build_profile: BuildProfileResponse | null;
  part: PartResponse | null;
}

export type PrintPlanListCreateResponse = null | {
  code: number;
  data: PrintPlanResponse;
}

export type PrintPlanListReadResponse = null | {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: PrintPlanResponse[];
  }
}

export type PrintPlanDetailReadResponse = null | {
  code: number;
  data: PrintPlanResponse;
}

export type PrintPlanDetailUpdateResponse = null | {
  code: number;
  data: PrintPlanResponse;
}

export type PrintPlanDetailDeleteResponse = null | {
  code: number;
  data: string;
};
