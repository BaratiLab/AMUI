/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Request
import { request } from 'common/request';

/**
 * @description API route to retrieve melt pool classification records.
 * @returns 
 */
export const getClassificationRecords = async () => {
  try {
    const response = await request('melt_pool/classification_records/');
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
export const getGeometryRecords = async () => {
  try {
    const response = await request('melt_pool/geometry_records/');
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
};
