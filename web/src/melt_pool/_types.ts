/**
 * _types.ts
 * Types within melt pool app.
 */

import { Status } from 'enums';

export interface MeltPoolFilterset {
  material?: string;
  process?: string;
  power?: number;
  velocity?: number;
  hatch_spacing?: number;
}

export interface RecordsSliceInitialState {
  data: {
    count: null | number,
    next: null | string,
    previous: null | string,
    results: Object[] 
  },
  status: Status,
  error: string | null | undefined
}