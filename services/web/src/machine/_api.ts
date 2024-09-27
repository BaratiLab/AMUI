/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Node Modules
import axios from 'axios';

/**
 * @description API route to retrieve machine specifications.
 * @returns
 */
export const getMachines = async () => {
  try {
    const response = await axios.get("machine/");
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};
