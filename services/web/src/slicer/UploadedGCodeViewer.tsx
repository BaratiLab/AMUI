/**
 * UploadedGCodeViewer.tsx
 * Component for viewing GCode converted from STL.
 */

// Node Modules
import Button from '@mui/material/Button';
import styled from '@emotion/styled'
import SendIcon from '@mui/icons-material/Send';
import { string } from "prop-types";
import { FC, ChangeEvent, useEffect, useState } from 'react';

// Actions
// import { fetchSTLToGCode } from 'slicer/stlToGCodeSlice';
// import { fetchUploadFile } from 'slicer/uploadFileSlice';
import { fetchUploadAndSlice } from 'slicer/uploadAndSliceSlice';
import { fetchRecentGCodeFiles } from 'slicer/recentGCodeFilesSlice';

// Components
import GCodeLayerViewer from 'slicer/GCodeLayerViewer';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Styled Components
export const StyledUploadedGCodeViewer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
  align-items: center;
}
`;
export const StyledUpload = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
export const StyledLabel = styled.label`
  margin-left: 0;
`;

export interface Props {
  className?: string;
}

const UploadedGCodeViewer: FC<Props> = ({ className }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const { response, status } = useAppSelector((state) => state.slicerUploadAndSlice);
  const { recentGCodeFilesResponse, recentGCodeFilesStatus } = useAppSelector((state) => state.recentGCodeFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log(recentGCodeFilesResponse, recentGCodeFilesStatus)

  useEffect(() => {
    dispatch(fetchRecentGCodeFiles());
  }, [dispatch])

  // Handler for file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handler for button click
  const handleUpload = () => {
    if (selectedFile) {
      dispatch(fetchUploadAndSlice(selectedFile));
    } else {
      alert("Please select a file first.");
    }
  };

  // JSX
  const uploadSuccessJSX = status === Status.Succeeded && (
    <div>
      <p>Upload and Slice Succeeded: {response.file}</p>
      {/* <button onClick={handleClick}>Slice</button> */}
    </div>
  );

  return (
    <StyledUploadedGCodeViewer className={className}>
      <GCodeLayerViewer status={status} url={response.file} />
      <StyledUpload>
        <input
          id="file-input"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <StyledLabel htmlFor="file-input">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </StyledLabel>
        <Button onClick={handleUpload} variant="outlined" endIcon={<SendIcon />}>
          Upload and Slice
        </Button>
      </StyledUpload>
      {uploadSuccessJSX}
    </StyledUploadedGCodeViewer>
  );
};

export default UploadedGCodeViewer;

UploadedGCodeViewer.propTypes = {
  className: string,
};
