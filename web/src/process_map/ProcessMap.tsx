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
import { FC, ReactNode, useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";

// Actions
import { setProcessMapNominalProcessParameters } from "./configurationSlice";

// Constants
const HEIGHT = 600;
const WIDTH = 600;

const MARGIN = { top: 0, right: 5, left: 5, bottom: 50 };

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
  classificationToPowerVelocity,
  classifyProcessMap,
  generateProcessMap,
  predictionToClassification,
  predictionToScatter
} from "./_utils";

// const legendFormatter = (value: string) => {
//   if (value !== undefined) {
//     switch (value) {
//       case "lackOfFusion":
//         return "Lack of Fusion";
//       default:
//         // Capitalize rest
//         return value[0].toUpperCase() + value.slice(1);
//     }
//   }
// };

const ProcessMap: FC<Props> = ({
  children,
  height = HEIGHT,
  margin = MARGIN,
  width = WIDTH,
}) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolEagarTsai);
  const { 
    data: inferenceData,
    status: inferenceStatus,
  } = useAppSelector((state) => state.meltPoolInference)
  const { hatchSpacing, layerThickness } = useAppSelector(
    (state) => state.processMapConfiguration,
  );
  const [data, setData] = useState<ProcessMapPoints[]>([]);
  const [inferenceProcessMap, setInferenceProcessMap] = useState({
    lackOfFusion: [],
    balling: [],
    keyhole: [],
    nominal: [],
  });
  const [showInference, setShowInference] = useState(false);
  const [xDomain, setXDomain] = useState<number[] | undefined>(undefined);
  const [yDomain, setYDomain] = useState<number[] | undefined>(undefined);
  const [opacity, setOpacity] = useState(0.1); // Initial opacity value

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate opacity based on sine wave function
      const newOpacity = Math.sin(Date.now() / 500) * 0.45 + 0.55; // Adjust values for desired range
      setOpacity(newOpacity);
    }, 50); // Adjust interval for smoother animation

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array to run effect only once

  useEffect(() => {
    if (inferenceStatus === Status.Succeeded) {
      // {0: 'LOF', 1: 'balling', 2: 'desirable', 3: 'keyhole'}
      const newData = [];
      const { powers, velocities } = state.data;
      const lofClassifications = predictionToClassification(inferenceData.prediction, 0);
      const nominalClassifications = predictionToClassification(inferenceData.prediction, 2);
      const ballingClassifications = predictionToClassification(inferenceData.prediction, 1);
      const keyholeClassifications = predictionToClassification(inferenceData.prediction, 3);
      setInferenceProcessMap({
        lackOfFusion: predictionToScatter(velocities, powers, lofClassifications, "lackOfFusion"),
        balling: predictionToScatter(velocities, powers, ballingClassifications, "balling"),
        keyhole: predictionToScatter(velocities, powers, keyholeClassifications, "keyhole"),
        nominal: predictionToScatter(velocities, powers, nominalClassifications, "nominal")
      });
    }
  }, [state.data.powers, state.data.velocities, inferenceData.prediction, inferenceStatus]);

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

      const processMapClassification = classifyProcessMap(processMap);

      for (const [key, value] of Object.entries(processMapClassification)) {
        if (key === "nominal") {
          const powerVelocity = classificationToPowerVelocity(
            velocities,
            powers,
            value,
          );
          const nominalParameters = powerVelocity.map(
            ({ power, velocity }) => ({
              power,
              velocity,
              hatchSpacing,
              layerThickness,
            }),
          );
          dispatch(setProcessMapNominalProcessParameters(nominalParameters));
        } else {
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
  }, [dispatch, state, hatchSpacing, layerThickness]);

  // JSX
  const renderLegendJSX = () => (
    <ul
      className="recharts-default-legend"
      style={{
        padding: 0,
        margin: 0,
        textAlign: "center",
      }}
    >
      <li className="recharts-legend-item legend-item-0" style={{display: "inline-block", marginRight: "10px"}}key="nominal">
        <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}><title></title><desc></desc><path fill="green" cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M-16,-16h32v32h-32Z"></path></svg>
        <span className="recharts-legend-item-text" style={{color: "green"}}>Nominal</span>
      </li>
      <li className="recharts-legend-item legend-item-1" style={{display: "inline-block", marginRight: "10px"}}key="keyhole">
        <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}><title></title><desc></desc><path fill="red" cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M-16,-16h32v32h-32Z"></path></svg>
        <span className="recharts-legend-item-text" style={{color: "red"}}>Keyhole</span>
      </li>
      <li className="recharts-legend-item legend-item-2" style={{display: "inline-block", marginRight: "10px"}}key="lackOfFusion">
        <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}><title></title><desc></desc><path fill="blue" cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M-16,-16h32v32h-32Z"></path></svg>
        <span className="recharts-legend-item-text" style={{color: "blue"}}>Lack of Fusion</span>
      </li>
      <li className="recharts-legend-item legend-item-3" style={{display: "inline-block", marginRight: "10px"}}key="balling">
        <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}><title></title><desc></desc><path fill="purple" cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M-16,-16h32v32h-32Z"></path></svg>
        <span className="recharts-legend-item-text" style={{color: "purple"}}>Balling</span>
      </li>
    </ul>
  )

  return (
    <Box>
      <ComposedChart
        data={data}
        height={height}
        margin={margin}
        width={width}
      >
        <CartesianGrid
          fill={state.status === Status.Loading ? "gray" : "green"}
          // fill={state.status === Status.Loading ? "gray" : "white"}
          fillOpacity={state.status === Status.Loading ? opacity : 0.5}
          strokeDasharray="3 3"
        />
        <Area
          type={showInference ? "basis" : "step"}
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="balling"
          fill="purple"
          stroke="purple"
        />
        <Area
          type={showInference ? "basis" : "step"}
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="keyhole"
          fill="red"
          stroke="red"
        />
        <Area
          type={showInference ? "basis" : "step"}
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="lackOfFusion"
          stroke="blue"
          fill="blue"
        />
        <Area
          type={showInference ? "basis" : "step"}
          strokeOpacity={1}
          fillOpacity={0.5}
          dataKey="nominal"
          stroke="green"
          fill="green"
        />
        {/* <Legend
          formatter={legendFormatter}
          iconType="square"
          verticalAlign="bottom"
          wrapperStyle={{
            bottom: "20px",
            left: "35px",
          }}
        /> */}
        <Legend
          content={renderLegendJSX}
          iconType="square"
          verticalAlign="bottom"
          wrapperStyle={{
            bottom: "20px",
            left: "35px",
          }}
        />
        {showInference && (
          <>
            <Scatter data={inferenceProcessMap.nominal} fill="green"/>
            <Scatter data={inferenceProcessMap.lackOfFusion} fill="blue"/>
            <Scatter data={inferenceProcessMap.keyhole} fill="red"/>
            <Scatter data={inferenceProcessMap.balling} fill="purple"/>
          </>
        )}
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
        {/* <Scatter name="Keyhole" data={kh} fill="#8884d8" />
        <Scatter name="Desirable" data={d} fill="#82ca9d" />
        <Scatter name="LOF" data={lof} fill="#f9849d" /> */}
        {children}
      </ComposedChart>
      <FormControlLabel
        control={
          <Checkbox
            disabled={inferenceStatus !== Status.Succeeded}
            onChange={() => setShowInference((prevState) => !prevState)}
          />
        }
        label="Display Machine Learning Inference"
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      />
    </Box>
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
