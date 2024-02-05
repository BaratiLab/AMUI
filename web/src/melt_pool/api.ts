/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Node Modules
import queryString from 'query-string';

// Types
import { MeltPoolFilterset } from './types';

// Request
import { request } from 'common/request';

/**
 * @description API route to retrieve melt pool classification records.
 * @returns 
 */
export const getClassificationRecords = async (
  filterset?: MeltPoolFilterset
) => {
  try {
    const stringifiedFilterset = filterset && queryString.stringify(filterset);
    const response = await request(
      `melt_pool/classification_records/?${stringifiedFilterset || ""}`
    );
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
};

/**
 * @description API route to retrieve melt pool geometry records.
 * @returns 
 */
export const getGeometryRecords = async (
  filterset?: MeltPoolFilterset
) => {
  try {
    const stringifiedFilterset = filterset && queryString.stringify(filterset);
    const response = await request(
      `melt_pool/geometry_records/?${stringifiedFilterset || ""}`
    );
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
};
