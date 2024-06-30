/**
 * api.ts
 * Functions for calling API routes for slicer 
 */

// Node Modules
// import queryString from "query-string";
import axios from 'axios';

// Types
// import {
//   MeltPoolFilterset,
//   MeltPoolInferenceProcessParameters,
// } from "./_types";

// Request
import { request } from "common/request";

const csrfToken = localStorage.getItem('csrfToken');

/**
 * @description API route to convert STL file to GCode.
 * @returns
 */
export const postSTLToGcode = async (file: string) => {
  try {
    // const stringifiedFilterset = filterset && queryString.stringify(filterset);
    // const response = await request(`melt_pool/records/?${stringifiedFilterset || ""}`,);
    const response = await request('slicer/stl_to_gcode/', "POST", { file });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description API route to upload 3D model and slice to GCode
 * @param file 
 * @returns 
 */
export const postUploadAndSlice = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('slicer/upload_and_slice/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken,
      }
    });

    const data = response.data;
    return data 
  } catch (error) {
    console.log(error);
  }
};
