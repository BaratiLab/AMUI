/**
 * _api.ts
 * Functions for calling API routes for build profiles.
 */

// Node Modules
import axios from 'axios';

// Types
import type {
  Part,
  PartListCreateResponse,
  PartListReadResponse,
  PartDetailReadResponse,
  PartDetailUpdateResponse,
  PartDetailDeleteResponse,
} from "part/_types";

/**
 * @description API route to retrieve build profiles.
 * @returns 
 */
export const getParts = async (): Promise<PartListReadResponse> => {
  try {
    const response = await axios.get('part/');
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description API route to delete individual build profile.
 * @returns 
 */
export const deletePart = async (id: string): Promise<PartDetailDeleteResponse> => {
  try {
    const response = await axios.delete(`part/${id}/`);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description API route to retrieve individual build profile details.
 * @returns 
 */
export const getPart = async (id: string): Promise<PartDetailReadResponse> => {
  try {
    const response = await axios.get(`part/${id}/`);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const putPart = async (part: Part): Promise<PartDetailUpdateResponse> => {
  try {
    const response = await axios.put(`part/${part.id}/`, part);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const postPart = async (part: Part): Promise<PartListCreateResponse>=> {
  try {
    const response = await axios.post('part/',  part);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};
