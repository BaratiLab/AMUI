/**
 * types.ts
 * Types for build profiles.
 */

export interface BuildProfile {
  id?: number | null;
  title: string;
  description: string;
  material: number | null;
}

export interface BuildProfileResponse extends BuildProfile {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  material_name: string | null;
}

export type BuildProfileListCreateResponse = null | BuildProfileResponse;
export type BuildProfileListReadResponse = null | {
  count: null | number;
  next: null | string;
  previous: null | string;
  results: BuildProfileResponse[];
}

export type BuildProfileDetailReadResponse = null | BuildProfileResponse;
export type BuildProfileDetailUpdateResponse = null | BuildProfileResponse;
export type BuildProfileDetailDeleteResponse = null | {
  code: number;
  data: string;
};
