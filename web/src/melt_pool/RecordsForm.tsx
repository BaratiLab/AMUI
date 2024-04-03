/**
 * RecordsForm.tsx
 * Form component for retrieving melt pool records given a machine preset.
 */

// Node Modules
import { FC, FormEvent, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, FormControl, Slider, Typography } from "@mui/material";

// Enums
import { Status } from "enums";

// Hooks
import { useAppSelector } from "hooks";
import { useProcessParametersByMaterial, useRecords } from "melt_pool/_hooks";

// Types
import { MeltPoolFilterset } from "./_types";

// Constants
const MIN_RANGE = {
  hatch_spacing: 10,
  power: 50,
  velocity: 5,
};

const REQUEST: MeltPoolFilterset = {
  material: "",
  power_min: 0,
  power_max: 1000,
  velocity_min: 0,
  velocity_max: 100,
  hatch_spacing_min: 0,
  hatch_spacing_max: 100,
};

const RecordsForm: FC = () => {
  // Hooks
  const [request, setRequest] = useState(REQUEST);
  const [
    {
      data: processParametersByMaterialData,
      status: processParametersByMaterialStatus,
    }
  ] = useProcessParametersByMaterial();
  const [{ status: recordsStatus }, getRecords] = useRecords();
  const processMapConfiguration = useAppSelector(
    (state) => state.processMapConfiguration,
  );

  console.log(request)

  useEffect(() => {
    // Sets initial process parameter range slider values.
    if (processParametersByMaterialStatus === Status.Succeeded) {
      const {
        // hatch_spacing_marks,
        power_marks,
        velocity_marks,
      } = processParametersByMaterialData;

      const request = {
        power_min: processMapConfiguration.power_min,
        power_max: processMapConfiguration.power_max,
        velocity_min: processMapConfiguration.velocity_min,
        velocity_max: processMapConfiguration.velocity_max,
      };

      if (power_marks.length > 1) {
        request.power_min = power_marks[0].value
        request.power_max = power_marks[1].value
      }

      if (velocity_marks.length > 1) {
        request.velocity_min = velocity_marks[0].value
        request.velocity_max = velocity_marks[1].value
      }

      setRequest((prevState) => ({
        ...prevState,
        ...request,
      }))
    }
  }, [
    processMapConfiguration,
    processParametersByMaterialData,
    processParametersByMaterialStatus,
  ]);

  // Callbacks

  /**
   * @description Updates request state with range slider values.
   * @param e Event
   * @param newValue number | number[]
   * @param activeThumb number
   * @returns 
   */
  const handleRangeSliderChange = (
    e: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "power" | "velocity" | "hatch_spacing";

    if (!Array.isArray(newValue)) {
      return;
    }

    const minRange = MIN_RANGE[name];

    if (newValue[1] - newValue[0] < MIN_RANGE[name]) {
      if (activeThumb === 0) {
        // Left Thumb
        const clamped = Math.min(newValue[0], 100 - minRange);
        setRequest((prevState) => ({
          ...prevState,
          [`${name}_min`]: clamped,
          [`${name}_max`]: clamped + minRange
        }));
      } else {
        // Right Thumb
        const clamped = Math.max(newValue[1], minRange);
        setRequest((prevState) => ({
          ...prevState,
          [`${name}_min`]: clamped - minRange,
          [`${name}_max`]: clamped,
        }));
      }
    } else {
      setRequest((prevState) => ({
        ...prevState,
        [`${name}_min`]: newValue[0],
        [`${name}_max`]: newValue[1],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getRecords(request);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: "column" }}
      >
        <FormControl fullWidth variant="standard">
          <Typography>Power (W)</Typography>
          <Slider
            name="power"
            value={[request.power_min, request.power_max]}
            disabled={processParametersByMaterialStatus === Status.Idle}
            onChange={handleRangeSliderChange}
            valueLabelDisplay="auto"
            min={processMapConfiguration.power_min}
            max={processMapConfiguration.power_max}
            marks={processParametersByMaterialData.power_marks}
            disableSwap
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Typography>Velocity (m/s)</Typography>
          <Slider
            name="velocity"
            value={[request.velocity_min, request.velocity_max]}
            valueLabelDisplay="auto"
            disabled={processParametersByMaterialStatus === Status.Idle}
            onChange={handleRangeSliderChange}
            min={processMapConfiguration.velocity_min}
            max={processMapConfiguration.velocity_max}
            marks={processParametersByMaterialData.velocity_marks}
            disableSwap
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Typography>Hatch Spacing (µm)</Typography>
          <Slider
            disabled={processParametersByMaterialStatus === Status.Idle}
            name="hatch_spacing"
            valueLabelDisplay="auto"
            value={[request.hatch_spacing_min, request.hatch_spacing_max]}
            onChange={handleRangeSliderChange}
            min={0}
            max={1000}
            marks={processParametersByMaterialData.hatch_spacing_marks}
            disableSwap
          />
        </FormControl>

        <LoadingButton
          loading={recordsStatus === Status.Loading}
          type="submit"
          variant="outlined"
        >
          Submit
        </LoadingButton>
      </Box>
    </form>
  );
};

export default RecordsForm;
