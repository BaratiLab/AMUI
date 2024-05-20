/**
 * api.ts
 * Functions for calling API routes for slicer 
 */

// Node Modules
// import queryString from "query-string";

// Types
// import {
//   MeltPoolFilterset,
//   MeltPoolInferenceProcessParameters,
// } from "./_types";

// Request
import { request } from "common/request";

/**
 * @description API route to convert STL file to GCode.
 * @returns
 */
export const postSTLToGcode = async () => {
  try {
    // const stringifiedFilterset = filterset && queryString.stringify(filterset);
    // const response = await request(`melt_pool/records/?${stringifiedFilterset || ""}`,);
    const response = await request('slicer/stl_to_gcode/', "POST");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// /**
//  * @description API route to convert STL file to GCode.
//  * @returns
//  */
// export const postUploadFile = async () => {
//   try {
//     // const stringifiedFilterset = filterset && queryString.stringify(filterset);
//     // const response = await request(`melt_pool/records/?${stringifiedFilterset || ""}`,);
//     const response = await request('slicer/upload_file/', "POST");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
