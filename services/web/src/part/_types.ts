/**
 * types.ts
 * Types for part.
 */

// Part

export interface Part {
  id?: number | null;
  name: string;
}

export interface PartResponse {
  id: number;
  name: string;
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
  part_files: PartFileListResponse[];
}

export interface PartDetailResponse extends PartResponse {
  part_file: PartFileDetailResponse;
}

export interface PartListResponse extends PartResponse {
  part_file: PartFileListResponse;
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
  data: PartDetailResponse;
};

export type PartDetailUpdateResponse = null | {
  code: number;
  data: PartDetailResponse;
}

export type PartDetailDeleteResponse = null | {
  code: number;
  data: string;
};

// Part File

export interface PartFile {
  id?: number | null;
  file: File | null;
}

export interface PartFileResponse {
  id: number;
  file: string;
  created_by: string | null;
  created_on: string | null;
  updated_on: string | null;
}

export interface PartFileListResponse extends Omit<PartFileResponse, 'file'> {
  thumbnail: string;
}

export interface PartFileDetailResponse extends PartFileResponse {
  thumbnail: string;
}

export type PartFileListCreateResponse = null | {
  code: number;
  data: PartFileResponse;
};

export type PartFileListReadResponse = null | {
  code: number;
  data: {
    count: null | number;
    next: null | string;
    previous: null | string;
    results: PartFileResponse[];
  }
}

export type PartFileDetailReadResponse = null | {
  code: number;
  data: PartFileResponse;
};
