/**
 * api.ts
 * Functions for calling API routes for material
 */

// Node Modules
import axios from 'axios';

// Request
import { request } from "common/request";

/**
 * @description API route to retrieve materials.
 * @returns
 */
export const getMetals = async () => {
  try {
    // TODO: Replace with "materials/materials/" or something more appropriate.
    const response = await request("melt_pool/metals/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve list of materials from API
 * @returns 
 */
export const getMaterialList = async () => {
  try {
    const response = await axios.get('material/list/')
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};
