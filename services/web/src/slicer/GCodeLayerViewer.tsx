/**
 * GCodeLayerViewer.tsx
 * Component adapted from GCode Viewer to include slider to traverse layers.
 */

// Node Modules
import styled from '@emotion/styled'
import { Slider } from "@mui/material";
import { CSSProperties, FC, useState } from 'react';

// Components
import { GCodeViewer } from './GCodeViewer';

// Enums
import { Status } from 'enums';

// Styled Components
export const StyledGCodeLayerViewer = styled.div`
  display: flex;
  background-color: gray;
  border-radius: 10px;
  padding: 25px;
  width: fit-content;

  .slider-overrides {
    // Changes height from 100% to unset to allow slider work with flex.
    height: unset;
  }
`
// Types
interface Props {
  status: Status
  style?: CSSProperties
  url: string | null
}

const GCodeLayerViewer: FC<Props> = ({
  status = Status.Idle,
  style = {
    width: '500px',
    height: '500px'
  },
  url = "",
}) => {
  // Hooks
  const [layerIndex, setLayerIndex] = useState(0);
  const [maxLayerIndex, setMaxLayerIndex] = useState<null | number>(null);

  // Callbacks
  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "layerIndex";

    if (Array.isArray(newValue)) {
      return;
    }

    switch (name) {
      case "layerIndex":
        setLayerIndex(newValue);
    }
  };

  return (
    <StyledGCodeLayerViewer>
      <GCodeViewer
        orbitControls
        showAxes
        style={style}
        url={status === Status.Succeeded ? url as string : ""}
        layer = {layerIndex}
        onLayersLoaded ={(layers) => setMaxLayerIndex(layers - 1)}
      />
      <Slider
        className="slider-overrides"
        disabled={maxLayerIndex === null}
        disableSwap
        name="layerIndex"
        value={layerIndex}
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        orientation="vertical"
        min={0}
        max={maxLayerIndex as number}
        step={1}
      />
    </StyledGCodeLayerViewer>
  );
};

export default GCodeLayerViewer;
