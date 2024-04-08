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
  const [yDomain, setYDomain] = useState<number[] | undefined>(undefined);

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

      console.log("depths", depths)
      console.log("widths", widths)

    // keyhole_criterion = width/depth
    // balling_criterion = length/width
    // print("Keyhole Criterion: {:.05}".format(keyhole_criterion))
    // print("Balling Criterion: {:.05}".format(balling_criterion))

    // print("Aspect Ratio (h/w): {:.05}".format(aspect_ratio_hw))
    // print("Aspect Ratio (l/d): {:.05}".format(aspect_ratio_ld))
    // print(f'Total LoF Criterion: {aspect_ratio_hw+aspect_ratio_ld}')
    // print(f'LoF Condition Met?: {"Yes" if not (aspect_ratio_hw+aspect_ratio_ld) < 1 else "No"}')
    // print(f'Keyhole Condition Met?: {"Yes" if not keyhole_criterion > 1.5 else "No"}')
    // print(f'Balling Condition Met?: {"Yes" if balling_criterion > 2.3 else "No"}')
    // return aspect_ratio_hw+aspect_ratio_ld > 1, keyhole_criterion < 1.5, balling_criterion > 2.3 # True -> LoF, False -> Desirable

      const balling = lengths.map(
        (row, rowIndex) => row.map((column, columnIndex) =>
          column / widths[rowIndex][columnIndex]
        )
      )

      const ballingClassification = balling.map(
        (row) => row.map((column) => column > 2.3 ? 1 : 0)
      )

      console.log("balling", balling)
      console.log("balling classification", ballingClassification)

      const keyhole = widths.map(
        (row, rowIndex) => row.map((column, columnIndex) =>{
          const criteria = column / Math.abs(depths[rowIndex][columnIndex])
          return isNaN(criteria) ? Infinity : criteria
        }
        )
      )

      console.log("keyhole", keyhole)

      const keyholeClassification = keyhole.map(
        // (row) => row.map((column) => column <= 1.5 ? 1 : 0)
        (row) => row.map((column) => column <= 2.25 ? 1 : 0)
      )

      console.log("keyholeClassification", keyholeClassification)


      // lof = np.where(lof < 1, 0, 1)
      const lackOfFusionClassification = lackOfFusion.map(
        // 0 for ideal 
        // 1 for lack of fusion
        (row) => row.map((column) => column < 1 ? 0 : 1)
      );

      velocities.forEach((velocity, velocityIndex) => {
        let lackOfFusionPowerStartValue: number | undefined = undefined;
        let lackOfFusionPowerEndValue = 0;

        let keyholePowerStartValue: number | undefined = undefined;
        let keyholePowerEndValue = 0;

        let ballingPowerStartValue: number | undefined = undefined;
        let ballingPowerEndValue = 0;

        powers.forEach((power, powerIndex) => {
          const lof = lackOfFusionClassification[powerIndex][velocityIndex];
          const keyhole = keyholeClassification[powerIndex][velocityIndex];
          const balling = ballingClassification[powerIndex][velocityIndex];
          if (lackOfFusionPowerStartValue === undefined && lof === 1) {
            lackOfFusionPowerStartValue = power;
          }
          if (lof === 1) {
            lackOfFusionPowerEndValue = power;
          }

          if (keyholePowerStartValue === undefined && keyhole === 1) {
            keyholePowerStartValue = power;
          }
          if (keyhole === 1) {
            keyholePowerEndValue = power;
          }

          if (ballingPowerStartValue === undefined && balling === 1) {
            ballingPowerStartValue = power;
          }
          if (balling === 1) {
            ballingPowerEndValue = power;
          }
        });

        if (lackOfFusionPowerStartValue === undefined) {
          // Handles case if for some reason lack of fusion doesn't occur at
          // 0 power.
          lackOfFusionPowerStartValue = 0
        }

        let ballingRange = [ballingPowerStartValue, ballingPowerEndValue]
        if (ballingPowerStartValue === undefined && ballingPowerEndValue === 0) {
          ballingRange = undefined
        }

        let keyholeRange = [keyholePowerStartValue, keyholePowerEndValue]
        if (keyholePowerStartValue === undefined && keyholePowerEndValue === 0) {
          keyholeRange = undefined
        }

        newData.push({
          velocity,
          lackOfFusion: [lackOfFusionPowerStartValue, lackOfFusionPowerEndValue],
          keyhole: keyholeRange,
          balling: ballingRange,
        });
      });

      newData.push({
        velocity: velocities[velocities.length - 1],
        power: powers[powers.length - 1],
      });

      setXDomain([0, velocities[velocities.length - 1]])
      setYDomain([0, powers[powers.length - 1]])

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
        <YAxis dataKey="power" type="number" domain={yDomain}>
          <Label angle={-90} position="insideLeft" value="Power (W)" />
        </YAxis>
        <Legend formatter={legendFormatter} verticalAlign="top" />

        {/* <Scatter name="Keyhole" data={kh} fill="#8884d8" />
        <Scatter name="Desirable" data={d} fill="#82ca9d" />
        <Scatter name="LOF" data={lof} fill="#f9849d" /> */}

        <Area type="step" dataKey="keyhole" fill="red" stroke="red" />
        <Area type="step" dataKey="balling" fill="orange" stroke="orange" />
        <Area type="step" dataKey="desirable" stroke="green" fill="green" />
        <Area type="step" dataKey="lackOfFusion" stroke="yellow" fill="yellow" />
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
