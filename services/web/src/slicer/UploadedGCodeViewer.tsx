/**
 * UploadedGCodeViewer.tsx
 * Component for viewing GCode converted from STL.
 */

// Node Modules
import styled from '@emotion/styled'
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
export const StyledUploadedGCodeViewer = styled.div``;
export const StyledUpload = styled.div``;

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
