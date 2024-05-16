/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Request
import { request } from "common/request";

/**
 * @description API route to retrieve machine specifications.
 * @returns
 */
export const getSpecifications = async () => {
  try {
    const response = await request("machine/specifications/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
