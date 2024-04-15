/**
 * RecordsForm.tsx
 * Form component for retrieving melt pool records given a machine preset.
 */

// Node Modules
import { FC, FormEvent, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Checkbox,
  FormControl,
  Slider,
  FormControlLabel,
  Typography,
} from "@mui/material";

// Actions
// import { fetchEagarTsai } from "melt_pool/eagarTsaiSlice";

// Enums
import { Status } from "enums";

// Hooks
import { useAppSelector } from "hooks";
import { useProcessParameters, useRecords } from "melt_pool/_hooks";

// Types
import { MeltPoolFilterset } from "./_types";

// Constants
const MIN_RANGE = {
  hatch_spacing: 10,
  power: 50,
  velocity: 1,
};

const REQUEST: MeltPoolFilterset = {
  material: "",
  power_min: 0,
  power_max: 1000,
  velocity_min: 0,
  velocity_max: 10,
  hatch_spacing_min: 0,
  hatch_spacing_max: 100,
};

// Utils
const boundsFromRequest = (request: MeltPoolFilterset) => ({
  power: [request.power_min, request.power_max],
  velocity: [request.velocity_min, request.velocity_max],
  hatch_spacing: [request.hatch_spacing_min, request.hatch_spacing_max],
});

// const createStartEndMarks = (start: number, end: number) => ([
//   {
//     value: start,
//     label: `${start}`
//   },
//   {
//     value: end,
//     label: `${end}`
//   }
// ])

const RecordsForm: FC = () => {
  // Hooks
  // const dispatch = useAppDispatch();
  const [showDatapoints, setShowDatapoints] = useState(false);
  const [bounds, setBounds] = useState(boundsFromRequest(REQUEST));
  const [request, setRequest] = useState(REQUEST);
  const [{ data: processParametersData, status: processParametersStatus }] =
    useProcessParameters();
  const [{ status: recordsStatus }, getRecords] = useRecords();
  const processMapConfiguration = useAppSelector(
    (state) => state.processMapConfiguration,
  );

  console.log(request);

  useEffect(() => {
    // Sets initial process parameter range slider values.
    if (processParametersStatus === Status.Succeeded) {
      const {
        // hatch_spacing_marks,
        power_marks,
        velocity_marks,
      } = processParametersData;

      const request = {
        power_min: processMapConfiguration.power_min,
        power_max: processMapConfiguration.power_max,
        velocity_min: processMapConfiguration.velocity_min,
        velocity_max: processMapConfiguration.velocity_max,
      };

      if (power_marks.length > 1) {
        request.power_min = power_marks[0].value;
        request.power_max = power_marks[1].value;
      }

      if (velocity_marks.length > 1) {
        request.velocity_min = velocity_marks[0].value;
        request.velocity_max = velocity_marks[1].value;
      }

      setRequest((prevState) => ({
        ...prevState,
        ...request,
      }));
    }
  }, [processMapConfiguration, processParametersData, processParametersStatus]);

  useEffect(() => {
    // Updates bounds of slider bars
    if (showDatapoints && processParametersStatus === Status.Succeeded) {
      const { power_marks, velocity_marks, hatch_spacing_marks } =
        processParametersData;
      setBounds({
        power: [
          power_marks[0].value,
          power_marks[power_marks.length - 1].value,
        ],
        velocity: [
          velocity_marks[0].value,
          velocity_marks[velocity_marks.length - 1].value,
        ],
        hatch_spacing: [
          hatch_spacing_marks[0].value,
          hatch_spacing_marks[hatch_spacing_marks.length - 1].value,
        ],
      });
    } else {
      setBounds({
        power: [
          processMapConfiguration.power_min,
          processMapConfiguration.power_max,
        ],
        velocity: [
          processMapConfiguration.velocity_min,
          processMapConfiguration.velocity_max,
        ],
        hatch_spacing: [REQUEST.hatch_spacing_min, REQUEST.hatch_spacing_max],
      });
    }
  }, [
    showDatapoints,
    processParametersData,
    processParametersStatus,
    processMapConfiguration,
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
    activeThumb: number,
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
          [`${name}_max`]: clamped + minRange,
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
    // await dispatch(fetchEagarTsai());
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={showDatapoints}
            onClick={() => setShowDatapoints((prevState) => !prevState)}
          />
        }
        label="Show Datapoints"
      />
      <form onSubmit={handleSubmit}>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          marginTop="5px"
          sx={{ flexDirection: "column" }}
        >
          <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
            <Typography>Power (W)</Typography>
            <Slider
              disabled={processParametersStatus === Status.Idle}
              disableSwap
              name="power"
              value={[request.power_min, request.power_max]}
              valueLabelDisplay="auto"
              onChange={handleRangeSliderChange}
              min={bounds.power[0]}
              max={bounds.power[1]}
              marks={!showDatapoints || processParametersData.power_marks}
              step={showDatapoints ? null : MIN_RANGE.power}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">{bounds.power[0] || 0} W</Typography>
              <Typography variant="body2">{bounds.power[1]} W</Typography>
            </Box>
          </FormControl>

          <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
            <Typography>Velocity (m/s)</Typography>
            <Slider
              disabled={processParametersStatus === Status.Idle}
              disableSwap
              name="velocity"
              value={[request.velocity_min, request.velocity_max]}
              valueLabelDisplay="auto"
              onChange={handleRangeSliderChange}
              min={bounds.velocity[0]}
              max={bounds.velocity[1]}
              marks={!showDatapoints || processParametersData.velocity_marks}
              step={showDatapoints ? null : MIN_RANGE.velocity}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                {bounds.velocity[0] || 0} m/s
              </Typography>
              <Typography variant="body2">{bounds.velocity[1]} m/s</Typography>
            </Box>
          </FormControl>

          <FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
            <Typography>Hatch Spacing (µm)</Typography>
            <Slider
              disabled={processParametersStatus === Status.Idle}
              disableSwap
              name="hatch_spacing"
              value={[request.hatch_spacing_min, request.hatch_spacing_max]}
              valueLabelDisplay="auto"
              onChange={handleRangeSliderChange}
              min={bounds.hatch_spacing[0]}
              max={bounds.hatch_spacing[1]}
              marks={
                !showDatapoints || processParametersData.hatch_spacing_marks
              }
              step={showDatapoints ? null : MIN_RANGE.hatch_spacing}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                {bounds.hatch_spacing[0] || 0} µm
              </Typography>
              <Typography variant="body2">
                {bounds.hatch_spacing[1]} µm
              </Typography>
            </Box>
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
    </>
  );
};

export default RecordsForm;
