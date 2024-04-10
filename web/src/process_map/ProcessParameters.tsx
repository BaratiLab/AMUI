/**
 * ProcessParameters.tsx
 * Component for adjusting process parameters for process map.
 */

// Node Modules
import { FormControl, Slider, Typography } from "@mui/material";
import { FC } from "react";

// Actions
import {
  setProcessMapHatchSpacing,
  setProcessMapLayerThickness,
} from "./configurationSlice";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

const ProcessParameters: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const { hatchSpacing, layerThickness } = useAppSelector(
    (state) => state.processMapConfiguration,
  );

  // Callbacks
  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "hatchSpacing" | "layerThickness";

    if (Array.isArray(newValue)) {
      return;
    }

    switch (name) {
      case "hatchSpacing":
        dispatch(setProcessMapHatchSpacing(newValue));
        break;
      case "layerThickness":
        dispatch(setProcessMapLayerThickness(newValue));
        break;
    }
  };

  return (
    <>
      <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
        <Typography>Hatch Spacing</Typography>
        <Slider
          // disabled={processParametersStatus === Status.Idle}
          disableSwap
          name="hatchSpacing"
          value={hatchSpacing}
          valueLabelDisplay="auto"
          onChange={handleSliderChange}
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
          name="layerThickness"
          value={layerThickness}
          valueLabelDisplay="auto"
          onChange={handleSliderChange}
          min={0}
          max={100}
          marks={true}
          step={10}
        />
      </FormControl>
    </>
  );
};

export default ProcessParameters;
