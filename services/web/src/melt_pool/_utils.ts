/**
 * _utils.ts
 * Melt pool utility functions. 
 */

// Types
import { MeltPoolDimension, MeltPoolDefect } from "./_types"

export const meltPoolDimensionToMeltPoolDefect = (
  meltPoolDimension: MeltPoolDimension,
  hatchSpacing: number,
  layerThickness: number,
): MeltPoolDimensionRatio => {

  // aspect_ratio_hw = (hatch_spacing/(width + 1e-10))**2
  // aspect_ratio_ld = (layer_thickness/(depth + 1e-10))**2
  // ((processParameter * 1e-6) / (column + 1e-10)) ** 2,

  const length = meltPoolDimension["lengths_avg"];
  const width = meltPoolDimension["widths_avg"];
  const depth = meltPoolDimension["depths_avg"];

  const aspectRatioHeightWidth = ((hatchSpacing * 1e-6)/(width + 1e-10))**2
  const aspectRatioLengthDepth = ((layerThickness * 1e-6)/(depth + 1e-10))**2

  const lackOfFusion_ratio = aspectRatioHeightWidth + aspectRatioLengthDepth;
  const balling_ratio = length / width;
  const keyhole_ratio = width / Math.abs(depth);
  const keyhole = isNaN(keyhole_ratio) ? Infinity : keyhole_ratio;
}
