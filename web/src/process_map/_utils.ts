/**
 * _utils.ts
 * Functions for generating process map from provided data.
 */

// Types
import { PowerVelocity } from "./_types";
interface ProcessMapArea {
  [key: string]: number | (undefined | number)[] | undefined;
  velocity: number;
}

interface ProcessMap {
  balling: number[][];
  keyhole: number[][];
  lackOfFusion: number[][];
}

interface ProcessMapClassification {
  balling: boolean[][];
  keyhole: boolean[][];
  lackOfFusion: boolean[][];
  nominal: boolean[][];
}

/**
 * @description Aspect ratios for hatch spacing or layer thickness
 * @param dimensions 2D array of dimensions of either `widths` or `depths`.
 * @param processParameter `hatchSpacing` or `layerThickness`
 * @returns number[][]
 */
export const calculateAspectRatios = (
  dimensions: number[][],
  processParameter: number,
) =>
  dimensions.map((row) =>
    row.map(
      (column) =>
        // Determines aspect ratios from simulation data.
        // aspect_ratio_hw = (hatch_spacing/(width + 1e-10))**2
        // aspect_ratio_ld = (layer_thickness/(depth + 1e-10))**2
        ((processParameter * 1e-6) / (column + 1e-10)) ** 2,
    ),
  );

/**
 * @description Determines process map area for use with area chart in Recharts
 * @param velocities 1D array of velocities to use as X
 * @param powers 1D array of powers to use as Y
 * @param classifications 2D array of boolean classifications
 * @param key Classification such as `lackOfFusion`, `keyhole`, or `balling`
 * @returns ProcessArea[]
 */
export const calculateProcessMapArea = (
  velocities: number[],
  powers: number[],
  classifications: boolean[][],
  key: string,
): ProcessMapArea[] => {
  const data: ProcessMapArea[] = [];

  velocities.forEach((velocity, velocityIndex) => {
    let powerStartValue: number | undefined = undefined;
    let powerEndValue = 0;

    // Determines the y (power) start and end values for area within x (velocity)
    powers.forEach((power, powerIndex) => {
      const classification = classifications[powerIndex][velocityIndex];
      if (classification) {
        if (powerStartValue === undefined) {
          // Sets Y start
          // powerStartValue = key === "nominal" ? powers[powerIndex - 1]: power;
          powerStartValue = power;
        }
        // Sets Y end
        // powerEndValue = key === "nominal" ? powers[powerIndex + 1]: power;
        powerEndValue = power;
      }
    });

    // Constructs range to use for area
    let classificationRange: (undefined | number)[] | undefined = [
      powerStartValue,
      powerEndValue,
    ];
    if (powerStartValue === undefined && powerEndValue === 0) {
      // Sets area range to undefined if no values within that region
      classificationRange = undefined;
    }

    data.push({
      velocity,
      [key]: classificationRange,
    });
  });

  return data;
};

/**
 * @description Creates object of raw process maps values for conditions.
 * @param depths 2D array of melt pool depths
 * @param widths 2D array of melt pool widths
 * @param lengths 2D array of melt pool lengths
 * @param hatchSpacing Used in calculation of lack of fusion
 * @param layerThickness Used in calculation of lack of fusion
 * @returns ProcessMap
 */
export const generateProcessMap = (
  depths: number[][],
  widths: number[][],
  lengths: number[][],
  hatchSpacing: number,
  layerThickness: number,
): ProcessMap => {
  const hatchSpacingAspectRatios = calculateAspectRatios(widths, hatchSpacing);
  const layerThicknessAspectRatios = calculateAspectRatios(
    depths,
    layerThickness,
  );

  // Lack of Fusion
  const lackOfFusion = hatchSpacingAspectRatios.map((row, rowIndex) =>
    row.map(
      (column, columnIndex) =>
        column + layerThicknessAspectRatios[rowIndex][columnIndex],
    ),
  );

  // Balling
  const balling = lengths.map((row, rowIndex) =>
    row.map((column, columnIndex) => column / widths[rowIndex][columnIndex]),
  );

  // Keyhole
  const keyhole = widths.map((row, rowIndex) =>
    row.map((column, columnIndex) => {
      const criteria = column / Math.abs(depths[rowIndex][columnIndex]);
      return isNaN(criteria) ? Infinity : criteria;
    }),
  );

  return {
    balling,
    keyhole,
    lackOfFusion,
  };
};

/**
 * @description Creates an object of process map boolean classifications
 * @param processMap Contains `lackOfFusion`, `balling`, and `keyhole`.
 * @param threshold Optional argument for adjusting classification threshold.
 * @returns ProcessMapClassification
 */
export const classifyProcessMap = (
  processMap: ProcessMap,
  threshold = {
    balling: 2.3,
    keyhole: 2.25,
    // keyhole: 5,
    lackOfFusion: 1,
  },
): ProcessMapClassification => {
  // Balling
  const balling = processMap.balling.map((row) =>
    row.map((column) => column > threshold.balling),
  );

  // Keyhole
  const keyhole = processMap.keyhole.map(
    // (row) => row.map((column) => column <= 1.5 ? 1 : 0)
    (row) => row.map((column) => column <= threshold.keyhole),
  );

  // Lack of Fusion
  const lackOfFusion = processMap.lackOfFusion.map((row) =>
    row.map((column) => column >= threshold.lackOfFusion),
  );

  // Nominal
  const nominal = processMap.lackOfFusion.map((row, rowIndex) =>
    row.map(
      (_, columnIndex) =>
        !(
          balling[rowIndex][columnIndex] ||
          keyhole[rowIndex][columnIndex] ||
          lackOfFusion[rowIndex][columnIndex]
        ),
    ),
  );

  return {
    balling,
    keyhole,
    lackOfFusion,
    nominal,
  };
};

/**
 * @description Provides the power and velocity associated with classification.
 * @param velocities Order 1D array of velocity values
 * @param powers Order 1D array of power values
 * @param classification 2D array of process map classification.
 * @returns [{velocity, power}, ...]
 */
export const classificationToPowerVelocity = (
  velocities: number[],
  powers: number[],
  classification: number[][],
): PowerVelocity[] => {
  const processParameters: PowerVelocity[] = [];
  classification.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const power = powers[rowIndex]
      const velocity = velocities[columnIndex]
      if (column && power !== 0 && velocity !== 0) {
        // Finds values matching classification and not at 0 power or velocity.
        processParameters.push({ velocity, power });
      }
    });
  });
  return processParameters;
};
