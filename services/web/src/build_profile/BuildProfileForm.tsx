/**
 * BuildProfileForm.tsx
 * BuildProfile form for creating and updating buildProfile.
 */

// Node Modules
import { Box, Button, Container, FormControl, FormControlLabel, Switch, SelectChangeEvent, Slider, TextField, Typography } from '@mui/material';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

// Actions
import { updateBuildProfile } from 'build_profile/slice/detail';
import { createBuildProfile } from 'build_profile/slice/list';

// Actions (old)
import {fetchDimensions} from "melt_pool/slice/dimensions";

// Components
import MaterialSelect from 'material/MaterialSelect';
import MachineSelect from 'machine/MachineSelect';
import ProcessMapChart from 'process_map/ProcessMapChart';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

import { spatterMap, equation1 } from './spattermap';

// Styled Components
const StyledProcessMap = styled(Box)`
  grid-area: map;
`;

const StyledProcessMapContainer = styled(Container)`
  padding: 0px;
  display: grid;
  grid:
    "power velocity hatch_spacing layer_thickness" 75px 
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    / 1fr 1fr 1fr 1fr
`;

const StyledSlider = styled(Box)`
  margin-left: 25px;
  grid-area: slider;
  display: flex;
  gap: 50px;
`;

// Types
import {
  BuildProfileRequest,
  BuildProfileDetailResponse,
  BuildProfileListCreateResponse,
  BuildProfileDetailUpdateResponse,
} from 'build_profile/_types';

interface Props {
  buildProfile?: BuildProfileDetailResponse | null
}

interface Defects {
  lackOfFusion: number;
  balling: number;
  keyholing: number;
  selected: boolean;
}

interface DefectsMap {
  [key: string]: Defects;
}

interface Props {
  className?: string;
}

const BuildProfileForm: FC<Props> = ({ buildProfile = null }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [request, setRequest] = useState<BuildProfileRequest>({
    name: '',
    machine_id: null,
    material_id: null,
    layer_thickness: 0.000030,
    hatch_spacing: 0.000050,
    power: 100,
    velocity: 0.5,
  });

  const [isChanged, setIsChanged] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [showSpatter, setShowSpatter] = useState(false);
  const [spatterThreshold, setSpatterThreshold] = useState(10**5);

  const state = useAppSelector((state) => state.meltPoolDimensions);

  const processMap = useMemo(() => {
    return state.data.dimensions.reduce(
    (acc, dimension) => {
      const power = dimension["power"];
      const velocity = dimension["velocity"];
      const length = dimension["lengths_avg"];
      const width = dimension["widths_avg"];
      const depth = dimension["depths_avg"];
      const hatchSpacing = request.hatch_spacing * (10 ** 6)
      const layerThickness = request.layer_thickness * (10 ** 6)

      const hatchSpacingWidth = (hatchSpacing/(width + 1e-10))**2
      const layerThicknessDepth = (layerThickness/(depth + 1e-10))**2

      let widthDepth = width / Math.abs(depth);
      // Filter out keyholes that don't have minimum resolution
      if (width == depth || width / 20 < 2.6 || depth / 20 < 2.6) {
        widthDepth = NaN;
      }

      return {
        ...acc,
        [`${power}-${velocity}`]: {
          lackOfFusion: hatchSpacingWidth**2 + layerThicknessDepth**2,
          balling: length / width,
          keyholing: isNaN(widthDepth) ? Infinity : widthDepth,
          selected: Number(power) === Number(request.power) && Number(velocity) === Number(request.velocity),

          // TODO: Actually implement
          // spatter: showSpatter ? spatterMap[`${power}-${velocity}`] : false,
          spatter: showSpatter ? equation1(power, velocity * 1000) > spatterThreshold : false,
        }
      }
    }, {} as DefectsMap,
  )}, [
    state.data.dimensions,
    request.hatch_spacing,
    request.layer_thickness,
    request.power,
    request.velocity,
    showSpatter,
    spatterThreshold,
  ]);

  useEffect(() => {
    // Legacy method to fetch process map dimensions
    dispatch(fetchDimensions());
  }, [])

  useEffect(() => {
    // Updates disabled state of the submit button.
    if (buildProfile) {
      setIsChanged(
        request.name !== buildProfile.name ||
        request.machine_id !== buildProfile.machine.id ||
        request.material_id !== buildProfile.material.id ||
        request.layer_thickness !== buildProfile.layer_thickness || 
        request.hatch_spacing !== buildProfile.hatch_spacing ||
        request.power !== buildProfile.power ||
        request.velocity !== buildProfile.velocity
      );
    } else {
      setIsChanged(
        request.name !== '' ||
        request.machine_id !== null ||
        request.material_id !== null ||
        request.layer_thickness !== 0.000030 ||
        request.hatch_spacing !== 0.000050 ||
        request.power !== 100 ||
        request.velocity !== 0.5
      );
    }
  }, [request, buildProfile])

  useEffect(() => {
    // Sets request form object to `buildProfile` prop.
    // `buildProfile` prop is provided if editing existing project.
    if (buildProfile) {
      setRequest({
        name: buildProfile.name,
        machine_id: buildProfile.machine.id || null,
        material_id: buildProfile.material.id || null,
        layer_thickness: buildProfile.layer_thickness || 0.000030,
        hatch_spacing: buildProfile.hatch_spacing || 0.000050,
        power: buildProfile.power || 100,
        velocity: buildProfile.velocity || 0.5,
      });
    }
  }, [buildProfile]);

  // Callbacks
  const handleMouseDownCapture = useCallback(() => {
    if (tooltipData !== null) {
      setRequest((prevState) => ({
        ...prevState,
        power: tooltipData[1],
        velocity: tooltipData[0]
      }))
    }
  }, [tooltipData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  };

  const handleSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  };

  const handleClick = async () => {
    if (buildProfile) {
      // Sends request to update existing buildProfile.
      const { payload } = await dispatch(updateBuildProfile({
        // Adds id for update request
        id: buildProfile.id,
        ...request,
      }));
      if ((payload as BuildProfileDetailUpdateResponse)?.code === 200 ) {
        navigate("/build_profile");
      }
    } else {
      // Sends request to create new build profile.
      const { payload } = await dispatch(createBuildProfile(request));
      if ((payload as BuildProfileListCreateResponse)?.code === 201 ) {
        navigate("/build_profile");
      }
    }
  };

  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "hatch_spacing" | "layer_thickness";

    if (Array.isArray(newValue)) {
      return;
    }

    setRequest((prevState) => ({
      ...prevState,
      [name]: (newValue * (10 ** -6)).toFixed(6) // Convert from meters to micron
    }));
  };

  const handleSpatterSliderChange = (e: Event, newValue: number | number[]) => {
    setSpatterThreshold(newValue as number);
  };

  // JSX
  const processMapJSX = request.material_id === 2 && (
    <StyledProcessMapContainer>
      <TextField
        label="Power (W)"
        name="power"
        value={request.power}
        sx={{ "gridArea": "power", marginRight: "0.5em"}}
      />
      <TextField
        label="Velocity (m/s)"
        name="velocity"
        value={request.velocity}
        sx={{ "gridArea": "velocity", marginLeft: "0.5em", marginRight: "0.5em"}}
      />
      <TextField
        label="Hatch Spacing (μm)"
        name="hatch_spacing"
        value={request.hatch_spacing * (10 ** 6)}
        sx={{ "gridArea": "hatch_spacing", marginLeft: "0.5em", marginRight: "0.5em"}}
      />
      <TextField
        label="Layer Thickness (μm)"
        name="layer_thickness"
        value={request.layer_thickness * (10 ** 6)}
        sx={{ "gridArea": "layer_thickness", marginLeft: "0.5em"}}
      />
      <FormControlLabel
        control={
          <Switch
            checked={showSpatter}
            onChange={() => setShowSpatter((prevState) => !prevState)}
          />
        }
        label="Show Potential Spatter"
      />
      <StyledProcessMap>
        <ParentSize>
          {({ width, height }) => (
            <ProcessMapChart
              width={width}
              height={height}
              domains={state.domains}
              processMap={processMap}
              meltPoolDimensions={state.data.dimensions}
              onMouseDownCapture={handleMouseDownCapture}
              onTooltipChange={(data) => setTooltipData(data)}
            />
          )}
        </ParentSize>
      </StyledProcessMap>
      <StyledSlider>
        <FormControl
          sx={{
            alignItems: "center",
            paddingBottom: "125px",
          }}
          variant="standard"
        >
          <Slider
            // disabled={processParametersStatus === Status.Idle}
            disableSwap
            name="hatch_spacing"
            value={request.hatch_spacing * (10 ** 6)}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            orientation="vertical"
            min={0}
            max={100}
            marks={true}
            step={10}
          />
          <Typography paddingTop="10px" textAlign="center">
            {"Hatch Spacing (μm)"}
          </Typography>
        </FormControl>
        <FormControl
          sx={{
            alignItems: "center",
            paddingBottom: "125px",
          }}
          variant="standard"
        >
          <Slider
            // disabled={processParametersStatus === Status.Idle}
            disableSwap
            name="layer_thickness"
            value={request.layer_thickness * (10 ** 6)}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            orientation="vertical"
            min={0}
            max={100}
            marks={true}
            step={10}
          />
          <Typography paddingTop="10px" textAlign="center">
            {"Layer Thickness (μm)"}
          </Typography>
        </FormControl>
        {showSpatter && (
          <FormControl
            sx={{
              alignItems: "center",
              paddingBottom: "125px",
            }}
            variant="standard"
          >
            <Slider
              // disabled={processParametersStatus === Status.Idle}
              disableSwap
              name="spatter_threshold"
              value={spatterThreshold}
              valueLabelDisplay="auto"
              onChange={handleSpatterSliderChange}
              orientation="vertical"
              min={10**4}
              max={10**6}
              marks={true}
              step={10**4}
            />
            <Typography paddingTop="10px" textAlign="center">
              {"Spatter Threshold"}
            </Typography>
          </FormControl>
        )}
      </StyledSlider>
    </StyledProcessMapContainer>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1em" }}>
      <TextField
        label="Name"
        name="name"
        onChange={handleChange}
        value={request.name}
      />
      <MachineSelect value={request.machine_id} onChange={handleSelect} />
      <MaterialSelect value={request.material_id} onChange={handleSelect} />
      {processMapJSX}
      <Button disabled={!isChanged} onClick={handleClick} variant="contained">
        {buildProfile === null ? "Create" :  "Update"} 
      </Button>
    </Box>
  );
};

export default BuildProfileForm;