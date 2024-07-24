/**
 * ProcessMap.tsx
 * Page component for displaying Process Map
 */

// Node Modules
import { Box } from "@mui/material";
import { FC, useEffect } from 'react';
import styled from "styled-components";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

// Actions
import {} from "melt_pool/flow3dSlice";

// Components
// import ProcessMap from 'process_map/ProcessMap';
import ProcessMapChart from "process_map/ProcessMapChart";

// Hooks
import { useAppDispatch } from "hooks";

// Styled Components
const StyledProcessMap = styled(Box)`
  grid-area: map;
`;

const StyledProcessMapPage = styled(Box)`
  display: grid;
  grid:
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    "map map map slider" minmax(100px, 200px)
    "footer footer footer footer" minmax(100px, 200px)
    / 1fr 1fr 1fr 1fr
`;

const StyledSlider = styled(Box)`
  background-color: green;
  grid-area: slider;
`;

const StyledFooter = styled(Box)`
  background-color: red;
  grid-area: footer;
`;

const ProcessMapPage: FC = ({ className }) => {
  // Hooks
  const dispatch = useAppDispatch();

  return (
    <StyledProcessMapPage className={className}>
      <StyledProcessMap>
        <ParentSize>
          {({ width, height }) => <ProcessMapChart width={width} height={height} />}
        </ParentSize>
      </StyledProcessMap>
      <StyledSlider />
      <StyledFooter />
    </StyledProcessMapPage>
  );
};

export default ProcessMapPage;
