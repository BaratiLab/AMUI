/**
 * Slicer.tsx
 * test page for slicer 
 */

// Node Modules
import { FC, ChangeEvent, useState } from 'react';

// Actions
import { fetchSTLToGCode } from 'slicer/stlToGCodeSlice';
import { fetchUploadFile } from 'slicer/uploadFileSlice';

// Hooks
import { useAppDispatch } from 'hooks';

const Slicer: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Callbacks
  const handleClick = () => {
    dispatch(fetchSTLToGCode());
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

  return (
    <div>
      <button onClick={handleClick}>Slicer</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
};

export default Slicer 
