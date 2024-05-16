/**
 * api.ts
 * Functions for calling API routes for surrogate app.
 */

// Node Modules
import queryString from "query-string";

// Request
import { request } from "common/request";

// Types
import { SurrogateSimulationParameters } from "./_types";

/**
 * @description API route to retrieve simulation for surrogate melt pool.
 * @returns 
 */
export const getSimulation = async (
  simulationParameters: SurrogateSimulationParameters
) => {
  try {
    const response = await request(
      `surrogate/simulation/?${queryString.stringify(simulationParameters)}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
