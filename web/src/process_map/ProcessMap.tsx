/**
 * ProcessMap.tsx
 * Composed chart component for displaying process map
 */

// Node Modules
import {
  arrayOf,
  node,
  number,
  oneOfType,
  // shape
} from "prop-types";
import { FC, ReactNode } from "react";
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

// Constants
const HEIGHT = 500;
const WIDTH = 500;

const MARGIN = { top: 10, right: 5, left: 20, bottom: 20 };

// Types
import { ProcessMapPoints } from "./_types";
interface Props {
  children?: ReactNode;
  data: ProcessMapPoints[];
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

const ProcessMap: FC<Props> = ({
  children,
  data,
  height = HEIGHT,
  margin = MARGIN,
  width = WIDTH,
}) => {

  return (
    <ComposedChart data={data} height={height} margin={margin} width={width}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="velocity" type="number">
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
