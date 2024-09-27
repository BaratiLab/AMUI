/**
 * types.ts
 * Types for part.
 */

export interface Part {
  id?: number | null;
  name: string;
}

export interface PartResponse extends Part {
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
}

export type PartListCreateResponse = null | {
  code: number;
  data: PartResponse;
};

export type PartListReadResponse = null | {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: PartResponse[];
  }
}

export type PartDetailReadResponse = null | {
  code: number;
  data: PartResponse;
};

export type PartDetailUpdateResponse = null | {
  code: number;
  data: PartResponse;
}

export type PartDetailDeleteResponse = null | {
  code: number;
  data: string;
};
