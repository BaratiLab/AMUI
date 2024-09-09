/**
 * ProcessMap.tsx
 * Page component for displaying Process Map
 */

// Node Modules
import { Box, FormControl, Slider, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from 'react';
import styled from "styled-components";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

// Actions
import {fetchDimensions} from "melt_pool/slice/dimensions";

// Components
// import ProcessMap from 'process_map/ProcessMap';
import ProcessMapChart from "process_map/ProcessMapChart";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

// Styled Components
const StyledProcessMap = styled(Box)`
  grid-area: map;
`;

const StyledProcessMapPage = styled(Box)`
  padding: 25px;
  display: grid;
  grid:
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    "footer footer footer footer" minmax(100px, 200px)
    / 1fr 1fr 1fr 1fr
`;

const StyledSlider = styled(Box)`
  // background-color: green;
  margin-left: 25px;
  grid-area: slider;
  display: flex;
  gap: 50px;
`;

const StyledFooter = styled(Box)`
  // background-color: red;
  grid-area: footer;
`;

interface Defects {
  lackOfFusion: number;
  balling: number;
  keyholing: number;
}

interface DefectsMap {
  [key: string]: Defects;
}

interface Props {
  className?: string;
}

const ProcessMapPage: FC<Props> = ({ className }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolDimensions);
  const [hatchSpacing, setHatchSpacing] = useState(50);
  const [layerThickness, setLayerThickness] = useState(30);

  useEffect(() => {
    dispatch(fetchDimensions());
  }, [])

  const processMap = useMemo(() => {
    return state.data.dimensions.reduce(
    (acc, dimension) => {
      const length = dimension["lengths_avg"];
      const width = dimension["widths_avg"];
      const depth = dimension["depths_avg"];

      const hatchSpacingWidth = (hatchSpacing/(width + 1e-10))**2
      const layerThicknessDepth = (layerThickness/(depth + 1e-10))**2

      let widthDepth = width / Math.abs(depth);
      // Filter out keyholes that don't have minimum resolution
      if (width == depth || width / 20 < 2.6 || depth / 20 < 2.6) {
        widthDepth = NaN;
      }

      const key = `${dimension["power"]}-${dimension["velocity"]}`

      return {
        ...acc,
        [key]: {
          lackOfFusion: hatchSpacingWidth**2 + layerThicknessDepth**2,
          balling: length / width,
          keyholing: isNaN(widthDepth) ? Infinity : widthDepth
        }
      }
    }, {} as DefectsMap,
  )}, [state.data.dimensions, hatchSpacing, layerThickness]);

  // Callbacks
  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "hatchSpacing" | "layerThickness";

    if (Array.isArray(newValue)) {
      return;
    }

    switch (name) {
      case "hatchSpacing":
        setHatchSpacing(newValue);
        break;
      case "layerThickness":
        setLayerThickness(newValue);
        break;
    }
  };

  return (
    <StyledProcessMapPage className={className}>
      <StyledProcessMap>
        <ParentSize>
          {({ width, height }) => (
            <ProcessMapChart
              width={width}
              height={height}
              domains={state.domains}
              processMap={processMap}
              meltPoolDimensions={state.data.dimensions}
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
            name="hatchSpacing"
            value={hatchSpacing}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            orientation="vertical"
            min={0}
            max={100}
            marks={true}
            step={10}
          />
          <Typography paddingTop="10px">{"Hatch Spacing (μm)"}</Typography>
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
            name="layerThickness"
            value={layerThickness}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            orientation="vertical"
            min={0}
            max={100}
            marks={true}
            step={10}
          />
          <Typography paddingTop="10px">{"Layer Thickness (μm)"}</Typography>
        </FormControl>
      </StyledSlider>
      <StyledFooter />
    </StyledProcessMapPage>
  );
};

export default ProcessMapPage;
