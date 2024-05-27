/**
 * UploadedGCodeViewer.tsx
 * Component for viewing GCode converted from STL.
 */

// Node Modules
import styled from '@emotion/styled'
import { Slider } from "@mui/material";
import { string } from "prop-types";
import { FC, ChangeEvent, useState } from 'react';

// Actions
import { fetchSTLToGCode } from 'slicer/stlToGCodeSlice';
import { fetchUploadFile } from 'slicer/uploadFileSlice';

// Components
import { GCodeViewer } from './GCodeViewer';
// import PrintPreview from 'common/PrintPreview';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Styled Components
export const StyledUploadedGCodeViewer = styled.div``;
export const StyledUpload = styled.div``;
export const StyledViewer = styled.div`
  display: flex;

  .slider-overrides {
    // Changes height from 100% to unset to allow slider work with flex.
    height: unset;
  }
`

export interface Props {
  className?: string;
}

const UploadedGCodeViewer: FC<Props> = ({ className }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.slicerUploadFile);
  const { response, status } = useAppSelector((state) => state.slicerSTLToGCode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [layer, setLayer] = useState(1);
  const [maxLayerIndex, setMaxLayerIndex] = useState<null | number>(null);

  // Callbacks
  const handleClick = () => {
    dispatch(fetchSTLToGCode(state.response.file as string));
  };

  // Handler for file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handler for button click
  const handleUpload = () => {
    if (selectedFile) {
      dispatch(fetchUploadFile(selectedFile));
    } else {
      alert("Please select a file first.");
    }
  };

  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    const formElement = e.target as HTMLFormElement;
    const name = formElement?.name as "layer";

    if (Array.isArray(newValue)) {
      return;
    }

    switch (name) {
      case "layer":
        setLayer(newValue);
    }
  };

  // JSX
  const uploadSuccessJSX = state.status === Status.Succeeded && (
    <div>
      <p>Upload Succeeded: {state.response.file}</p>
      <button onClick={handleClick}>Slice</button>
      {/* <PrintPreview
        stlUrl={state.response.file as string}
        gcodeUrl={response.file ? response.file : undefined}
      /> */}
    </div>
  );

  return (
    <StyledUploadedGCodeViewer className={className}>
      <StyledUpload>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadSuccessJSX}
      </StyledUpload>
      <StyledViewer>
        <GCodeViewer
          orbitControls
          showAxes
          style={{
            width: '500px',
            height: '500px'
          }}
          url={status === Status.Succeeded ? response.file : undefined}
          layer = {layer}
          onLayersLoaded ={(layers) => setMaxLayerIndex(layers - 1)}
        />
        <Slider
          className="slider-overrides"
          disabled={maxLayerIndex === null}
          disableSwap
          name="layer"
          value={layer}
          valueLabelDisplay="auto"
          onChange={handleSliderChange}
          orientation="vertical"
          min={0}
          max={maxLayerIndex as number}
          step={1}
        />
      </StyledViewer>
    </StyledUploadedGCodeViewer>
  );
};

export default UploadedGCodeViewer;

UploadedGCodeViewer.propTypes = {
  className: string,
};
