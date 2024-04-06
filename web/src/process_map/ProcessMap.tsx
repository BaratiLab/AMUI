/**
 * ProcessMap.tsx
 * Composed chart component for displaying process map
 */

// Node Modules
import { Box, LinearProgress, FormControl, Slider, Typography} from "@mui/material";
import {
  arrayOf,
  node,
  number,
  oneOfType,
  // shape
} from "prop-types";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  // Scatter,
  XAxis,
  YAxis,
} from "recharts";

// Actions
import { fetchEagarTsai } from "melt_pool/eagarTsaiSlice"

// Constants
const HEIGHT = 500;
const WIDTH = 500;

const MARGIN = { top: 10, right: 5, left: 20, bottom: 20 };

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

// Types
import { ProcessMapPoints } from "./_types";
import { Status } from "enums";
interface Props {
  children?: ReactNode;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  width?: number;
}

// Utils
const legendFormatter = (value: string) => {
  switch (value) {
    case "keyhole":
      return "Keyhole";
    case "desirable":
      return "Desirable";
    case "lackOfFusion":
      return "Lack of Fusion";
    default:
      return value;
  }
};

// hatch_spacing = 0.000025
// layer_thickness = 0.000025

const aspectRatios = (dimensions: number[][], processParameter: number) =>
  dimensions.map((row) =>
    row.map((column) => ((processParameter * 1e-6)/(column + 1e-10))**2)
  );

const ProcessMap: FC<Props> = ({
  children,
  height = HEIGHT,
  margin = MARGIN,
  width = WIDTH,
}) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolEagarTsai);
  const [data, setData] = useState<ProcessMapPoints[]>([]);
  const [hatchSpacing, setHatchSpacing] = useState(25); // in microns
  const [layerThickness, setLayerThickness] = useState(25);
  const [xDomain, setXDomain] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    // Fetches Eagar Tsai data on load.
    dispatch(fetchEagarTsai());
  }, [dispatch]);

  useEffect(() => {
    if (state.status === Status.Succeeded) {
      const newData = []
      const {
        depths,
        lengths,
        widths,
        powers,
        velocities,
      } = state.data

      // aspect_ratio_hw = (hatch_spacing/(width + 1e-10))**2
      console.log(((hatchSpacing * 1e-6)/(widths[0][0] + 1e-10))**2)
      const hatchSpacingAspectRatios = aspectRatios(widths, hatchSpacing);
      console.log(hatchSpacingAspectRatios[0][0])


      console.log((layerThickness/(depths[0][0] + 1e-10))**2)
      // aspect_ratio_ld = (layer_thickness/(depth + 1e-10))**2
      const layerThicknessAspectRatios = aspectRatios(depths, layerThickness);
      console.log(layerThicknessAspectRatios[0][0])

      // lof = aspect_ratio_hw+aspect_ratio_ld
      const lackOfFusion = hatchSpacingAspectRatios.map(
        (row, rowIndex) => row.map((column, columnIndex) =>
          column + layerThicknessAspectRatios[rowIndex][columnIndex]
        )
      );

      // lof = np.where(lof < 1, 0, 1)
      const lackOfFusionClassification = lackOfFusion.map(
        // 0 for ideal 
        // 1 for lack of fusion
        (row) => row.map((column) => column < 1 ? 0 : 1)
      );

      velocities.forEach((velocity, velocityIndex) => {
        let lackOfFusionPowerStartValue: number | undefined = undefined;
        let lackOfFusionPowerEndValue = 0;
        powers.forEach((power, powerIndex) => {
          const classification = lackOfFusionClassification[powerIndex][velocityIndex];
          if (lackOfFusionPowerStartValue === undefined && classification === 1) {
            lackOfFusionPowerStartValue = power;
          }
          if (classification === 1) {
            lackOfFusionPowerEndValue = power;
          }
        });

        if (lackOfFusionPowerStartValue === undefined) {
          // Handles case if for some reason lack of fusion doesn't occur at
          // 0 power.
          lackOfFusionPowerStartValue = 0
        }

        newData.push({
          velocity,
          lackOfFusion: [lackOfFusionPowerStartValue, lackOfFusionPowerEndValue]
        });
      });

      newData.push({
        velocity: velocities[velocities.length - 1],
        power: powers[powers.length - 1],
      });

      setXDomain([0, velocities[velocities.length - 1]])

      setData(newData);
    }
  }, [state, hatchSpacing, layerThickness]);

  console.log(data)

  // JSX
  const loadingJSX = state.status === Status.Loading && (
    <Box>
      <LinearProgress />
    </Box>
  )


  return (
    <>
      {loadingJSX}
      <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
        <Typography>Hatch Spacing</Typography>
        <Slider
          // disabled={processParametersStatus === Status.Idle}
          disableSwap
          // name="power"
          value={hatchSpacing}
          valueLabelDisplay="auto"
          onChange={(_, value) => setHatchSpacing(value as number)}
          min={0}
          max={100}
          marks={true}
          step={10}
        />
      </FormControl>
      <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
        <Typography>Layer Thickness</Typography>
        <Slider
          // disabled={processParametersStatus === Status.Idle}
          disableSwap
          // name="power"
          value={layerThickness}
          valueLabelDisplay="auto"
          onChange={(_, value) => setLayerThickness(value as number)}
          min={0}
          max={100}
          marks={true}
          step={10}
        />
      </FormControl>
      <ComposedChart data={data} height={height} margin={margin} width={width}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="velocity" type="number" domain={xDomain}>
          <Label position="bottom" value="Velocity (mm/s)" />
        </XAxis>
        <YAxis dataKey="power" type="number">
          <Label angle={-90} position="insideLeft" value="Power (W)" />
        </YAxis>
        <Legend formatter={legendFormatter} verticalAlign="top" />

        {/* <Scatter name="Keyhole" data={kh} fill="#8884d8" />
        <Scatter name="Desirable" data={d} fill="#82ca9d" />
        <Scatter name="LOF" data={lof} fill="#f9849d" /> */}

        <Area dataKey="keyhole" fill="#8884D8" stroke="#8884D8" />
        <Area dataKey="desirable" stroke="#82CA9D" fill="#82CA9D" />
        <Area dataKey="lackOfFusion" stroke="#F9849D" fill="#F9849D" />
        {children}
      </ComposedChart>
    </>
  );
};

export default ProcessMap;

ProcessMap.propTypes = {
  children: oneOfType([arrayOf(node), node]),
  // data: arrayOf(shape({
  //   velocity: number.isRequired,
  //   keyhole: oneOfType([number, arrayOf(number)]),
  //   desirable: oneOfType([number, arrayOf(number)]),
  //   lackOfFusion: oneOfType([number, arrayOf(number)]),
  //   power: number,
  // })).isRequired,
  height: number,
  width: number,
};
