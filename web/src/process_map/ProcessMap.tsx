/**
 * ProcessMap.tsx
 * Composed chart component for displaying process map
 */

// Node Modules
import { Box, LinearProgress } from "@mui/material";
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
import { fetchEagarTsai } from "melt_pool/eagarTsaiSlice";

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
import {
  calculateProcessMapArea,
  classifyProcessMap,
  generateProcessMap,
} from "./_utils";

const legendFormatter = (value: string) => {
  switch (value) {
    case "lackOfFusion":
      return "Lack of Fusion";
    default:
      // Capitalize rest
      return value[0].toUpperCase() + value.slice(1);
  }
};

const ProcessMap: FC<Props> = ({
  children,
  height = HEIGHT,
  margin = MARGIN,
  width = WIDTH,
}) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolEagarTsai);
  const { hatchSpacing, layerThickness } = useAppSelector(
    (state) => state.processMapConfiguration,
  );
  const [data, setData] = useState<ProcessMapPoints[]>([]);
  const [xDomain, setXDomain] = useState<number[] | undefined>(undefined);
  const [yDomain, setYDomain] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    // Fetches Eagar Tsai data on load.
    dispatch(fetchEagarTsai());
  }, [dispatch]);

  useEffect(() => {
    if (state.status === Status.Succeeded) {
      const newData = [];
      const { depths, lengths, widths, powers, velocities } = state.data;

      const processMap = generateProcessMap(
        depths,
        widths,
        lengths,
        hatchSpacing,
        layerThickness,
      );

      const processMapClassifications = classifyProcessMap(processMap);

      for (const [key, value] of Object.entries(processMapClassifications)) {
        if (key !== "nominal") {
          newData.push(
            ...calculateProcessMapArea(velocities, powers, value, key),
          );
        }
      }

      newData.push({
        velocity: velocities[velocities.length - 1],
        power: powers[powers.length - 1],
      });

      setXDomain([0, velocities[velocities.length - 1]]);
      setYDomain([0, powers[powers.length - 1]]);

      setData(newData);
    }
  }, [state, hatchSpacing, layerThickness]);

  console.log(data);

  // JSX
  const loadingJSX = state.status === Status.Loading && (
    <Box>
      <LinearProgress />
    </Box>
  );

  return (
    <>
      {loadingJSX}
      <ComposedChart data={data} height={height} margin={margin} width={width}>
        <CartesianGrid fill="green" fillOpacity={0.5} strokeDasharray="3 3" />
        <Area
          type="step"
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="balling"
          fill="purple"
          stroke="purple"
        />
        <Area
          type="step"
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="keyhole"
          fill="red"
          stroke="red"
        />
        <Area
          type="step"
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="lackOfFusion"
          stroke="blue"
          fill="blue"
        />
        <Area
          type="step"
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="nominal"
          stroke="green"
          fill="green"
        />
        <XAxis
          dataKey="velocity"
          domain={xDomain}
          ticks={state.data.velocities}
          type="number"
        >
          <Label position="bottom" value="Velocity (mm/s)" />
        </XAxis>
        <YAxis
          dataKey="power"
          domain={yDomain}
          type="number"
          ticks={state.data.powers}
        >
          <Label angle={-90} position="insideLeft" value="Power (W)" />
        </YAxis>
        <Legend formatter={legendFormatter} verticalAlign="top" />

        {/* <Scatter name="Keyhole" data={kh} fill="#8884d8" />
        <Scatter name="Desirable" data={d} fill="#82ca9d" />
        <Scatter name="LOF" data={lof} fill="#f9849d" /> */}
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
