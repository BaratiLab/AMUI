/**
 * GCodeLayerViewer.tsx
 * Component adapted from GCode Viewer to include slider to traverse layers.
 */

// Node Modules
import styled from '@emotion/styled'
import { Slider, Button, Typography } from "@mui/material";
import { CSSProperties, FC, useState } from 'react';

// Components
import { GCodeViewer } from './GCodeViewer';

// Enums
import { Status } from 'enums';

// Styled Components
export const StyledGCodeLayerViewer = styled.div`
  display: flex;
  background-image: linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09));
  border-radius: 10px;
  padding: 25px;
  width: fit-content;

  .slider-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 150px;
  }
`
// Types
interface Props {
  // status: Status
  style?: CSSProperties
  url: string | null
}

const GCodeLayerViewer: FC<Props> = ({
  // status = Status.Idle,
  style = {
    width: '500px',
    height: '500px'
  },
  url = "",
}) => {
  // Hooks
  const [layers, setLayers] = useState([]);
  const [layerIndex, setLayerIndex] = useState(0);
  const [maxLayerIndex, setMaxLayerIndex] = useState<null | number>(null);
  const [showSingleLayer, setShowSingleLayer] = useState(false);

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

  const handleLayersLoaded = (layers: object[][]) => {
    setLayers(layers);
    setMaxLayerIndex(layers.length - 1);
  };

  console.log(layers)

  return (
    <StyledGCodeLayerViewer>
      <GCodeViewer
        orbitControls
        showAxes
        style={style}
        // url={status === Status.Succeeded ? url as string : ""}
        url={url}
        layer = {showSingleLayer ? layerIndex : null}
        onLayersLoaded ={handleLayersLoaded}
      />
      <div className="slider-container">
        <Typography>
          {showSingleLayer ? `Layer: ${layerIndex + 1}` : 'All Layers'}
        </Typography>
        <Slider
          disabled={maxLayerIndex === null || !showSingleLayer}
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
        <Button onClick={() => setShowSingleLayer((prevState) => !prevState)}>
          <Typography>
            {showSingleLayer ? 'Show All' : 'Show Single'}
          </Typography>
        </Button>
      </div>
    </StyledGCodeLayerViewer>
  );
};

export default GCodeLayerViewer;
