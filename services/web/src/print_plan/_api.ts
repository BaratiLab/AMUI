/**
 * _api.ts
 * Functions for calling API routes for build profiles.
 */

// Node Modules
import axios from 'axios';

// Types
import type {
  PrintPlanRequest,
  PrintPlanListCreateResponse,
  PrintPlanListReadResponse,
  PrintPlanDetailReadResponse,
  PrintPlanDetailUpdateResponse,
  PrintPlanDetailDeleteResponse,
} from "print_plan/_types";

/**
 * @description API route to retrieve build profiles.
 * @returns 
 */
export const getPrintPlans = async (): Promise<PrintPlanListReadResponse> => {
  try {
    const response = await axios.get('print_plan/');
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
export const deletePrintPlan = async (id: string): Promise<PrintPlanDetailDeleteResponse> => {
  try {
    const response = await axios.delete(`print_plan/${id}/`);
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
export const getPrintPlan = async (id: string): Promise<PrintPlanDetailReadResponse> => {
  try {
    const response = await axios.get(`print_plan/${id}/`);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const putPrintPlan = async (printPlan: PrintPlanRequest): Promise<PrintPlanDetailUpdateResponse> => {
  try {
    const response = await axios.put(`print_plan/${printPlan.id}/`, printPlan);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const postPrintPlan = async (printPlan: PrintPlanRequest): Promise<PrintPlanListCreateResponse>=> {
  try {
    const response = await axios.post('print_plan/',  printPlan);
    const { data, status: code } = response;
    return { data, code };
  } catch (error) {
    console.log(error)
    return null;
  }
};
