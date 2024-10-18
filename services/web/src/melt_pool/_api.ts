/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Node Modules
import queryString from "query-string";

import axios from "axios";

// Types
import {
  MeltPoolFilterset,
  MeltPoolInferenceProcessParameters,
} from "./_types";

// Request
import { request } from "common/request";

/**
 * @description API route to retrieve melt pool records.
 * @returns
 */
export const getRecords = async (filterset?: MeltPoolFilterset) => {
  try {
    const stringifiedFilterset = filterset && queryString.stringify(filterset);
    const response = await request(
      `melt_pool/records/?${stringifiedFilterset || ""}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve melt pool dimensions.
 * @returns
 */
export const getDimensions = async () => {
  try {
    const response = await axios.get(`melt_pool/dimensions/`);
    const data = response.data;
    return data;
    // const response = await request(`melt_pool/dimensions/`);
    // const data = await response.json();
    // return data;
    // const response = await request(
    //   // `melt_pool/dimensions/?${stringifiedFilterset || ""}`,
    //   `melt_pool/dimensions/`,
    // );
    // const data = await response.json();
    // return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve melt pool process parameters by material.
 * @returns
 */
export const getProcessParameters = async (material: string) => {
  try {
    const response = await request(
      `melt_pool/process_parameters/?material=${material}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve Eagar Tsai data for process map
 * @returns
 */
export const getEagarTsai = async (material: string) => {
  try {
    const response = await request(
      `melt_pool/eagar_tsai/?material=${material}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve flow3d data for process map
 * @returns
 */
export const getFlow3D = async () => {
  try {
    const response = await request(`melt_pool/flow3d`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to retrieve MeltPoolNet Inference
 * @returns
 */
export const getInference = async (
  processParameters: MeltPoolInferenceProcessParameters,
) => {
  try {
    const response = await request(
      `melt_pool/inference/?${queryString.stringify(processParameters)}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
