/**
 * UploadedGCodeViewer.tsx
 * Component for viewing GCode converted from STL.
 */

// Node Modules
import styled from '@emotion/styled'
import { string } from "prop-types";
import { FC, ChangeEvent, useState } from 'react';

// Actions
import { fetchSTLToGCode } from 'slicer/stlToGCodeSlice';
import { fetchUploadFile } from 'slicer/uploadFileSlice';

// Components
import GCodeLayerViewer from 'slicer/GCodeLayerViewer';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Styled Components
export const StyledUploadedGCodeViewer = styled.div``;
export const StyledUpload = styled.div``;

export interface Props {
  className?: string;
}

const UploadedGCodeViewer: FC<Props> = ({ className }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.slicerUploadFile);
  const { response, status } = useAppSelector((state) => state.slicerSTLToGCode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // JSX
  const uploadSuccessJSX = state.status === Status.Succeeded && (
    <div>
      <p>Upload Succeeded: {state.response.file}</p>
      <button onClick={handleClick}>Slice</button>
    </div>
  );

  return (
    <StyledUploadedGCodeViewer className={className}>
      <StyledUpload>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadSuccessJSX}
      </StyledUpload>
      <GCodeLayerViewer status={status} url={response.file} />
    </StyledUploadedGCodeViewer>
  );
};

export default UploadedGCodeViewer;

UploadedGCodeViewer.propTypes = {
  className: string,
};
