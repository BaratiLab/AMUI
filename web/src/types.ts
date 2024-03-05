/**
 * types.ts
 * Types used within app.
 */

// Enums
import { Status } from 'enums';

export interface AsyncThunkInitialState {
  status: Status,
  error: string | null | undefined,
}
