/**
 * _api.ts
 * Functions for calling API routes for flow3d
 */

// Node Modules
import axios from 'axios';

interface XY {
  x: string,
  y: string,
}

export const postFlow3DTestTask = async (xy: XY) => {
  try {
    const response = await axios.post('flow3d/test_task/', xy);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};
