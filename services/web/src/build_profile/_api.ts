/**
 * _api.ts
 * Functions for calling API routes for build profiles.
 */

// Node Modules
import axios from 'axios';

// Types
import type {
  BuildProfile,
  BuildProfileListAPI,
} from './_types';

/**
 * @description API route to retrieve build profiles.
 * @returns 
 */
export const getBuildProfiles = async (): Promise<BuildProfileListAPI | undefined> => {
  try {
    const response = await axios.get('build_profile/');
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

/**
 * @description API route to delete individual build profile.
 * @returns 
 */
export const deleteBuildProfile = async (id: string)=> {
  try {
    const response = await axios.delete(`build_profile/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

/**
 * @description API route to retrieve individual build profile details.
 * @returns 
 */
export const getBuildProfile = async (id: string)=> {
  try {
    const response = await axios.get(`build_profile/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const putBuildProfile = async (id: string, buildProfile) => {
  try {
    const response = await axios.put(`build_profile/${id}/`, buildProfile);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const postBuildProfile = async (buildProfile: BuildProfile) => {
  try {
    const response = await axios.post('build_profile/',  buildProfile);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};
