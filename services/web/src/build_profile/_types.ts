/**
 * types.ts
 * Types for build profiles.
 */

// Types
import { AsyncThunkInitialState } from "types";

export interface BuildProfile {
  created_by: string;
  created_on: string;
  updated_on: string;
  title: string;
  description: string;
}

export interface BuildProfileListAPI {
  count: null | number;
  next: null | string;
  previous: null | string;
  results: BuildProfile[];
}

// Initial State
export interface ListSliceInitialState
  extends AsyncThunkInitialState {
  data: BuildProfile[];
  response: BuildProfileListAPI;
}