/**
 * _api.ts
 * Functions for calling API routes for build profiles.
 */

// Node Modules
import axios from 'axios';

// Types
import type {
  BuildProfile,
  BuildProfileListCreateResponse,
  BuildProfileListReadResponse,
  BuildProfileDetailReadResponse,
  BuildProfileDetailUpdateResponse,
  BuildProfileDetailDeleteResponse,
} from "build_profile/_types";

/**
 * @description API route to retrieve build profiles.
 * @returns 
 */
export const getBuildProfiles = async (): Promise<BuildProfileListReadResponse> => {
  try {
    const response = await axios.get('build_profile/');
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description API route to delete individual build profile.
 * @returns 
 */
export const deleteBuildProfile = async (id: string): Promise<BuildProfileDetailDeleteResponse> => {
  try {
    const response = await axios.delete(`build_profile/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description API route to retrieve individual build profile details.
 * @returns 
 */
export const getBuildProfile = async (id: string): Promise<BuildProfileDetailReadResponse> => {
  try {
    const response = await axios.get(`build_profile/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const putBuildProfile = async (buildProfile: BuildProfile): Promise<BuildProfileDetailUpdateResponse> => {
  try {
    const response = await axios.put(`build_profile/${buildProfile.id}/`, buildProfile);
    return response.data;
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const postBuildProfile = async (buildProfile: BuildProfile): Promise<BuildProfileListCreateResponse>=> {
  try {
    const response = await axios.post('build_profile/',  buildProfile);
    return response.data;
  } catch (error) {
    console.log(error)
    return null;
  }
};
