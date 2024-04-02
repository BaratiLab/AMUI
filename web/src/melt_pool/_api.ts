/**
 * api.ts
 * Functions for calling API routes for melt pool
 */

// Node Modules
import queryString from "query-string";

// Types
import { MeltPoolFilterset } from "./_types";

// Request
import { request } from "common/request";

// export const getEagarTsai = async ()

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
 * @description API route to retrieve melt pool process parameters.
 * @returns
 */
export const getProcessParameters = async () => {
  try {
    const response = await request("melt_pool/process_parameters/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
