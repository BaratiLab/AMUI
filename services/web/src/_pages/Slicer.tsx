/**
 * Slicer.tsx
 * test page for slicer 
 */

// Node Modules
// import { Slider } from "@mui/material";
import { FC, ChangeEvent, useState } from 'react';

// Actions
// import { fetchSTLToGCode } from 'slicer/stlToGCodeSlice';
// import { fetchUploadFile } from 'slicer/uploadFileSlice';

// Components
// import PrintPreview from 'common/PrintPreview';
import UploadedGCodeViewer from "slicer/UploadedGCodeViewer";

// Hooks
// import { useAppDispatch, useAppSelector } from 'hooks';
// import { Status } from 'enums';

const Slicer: FC = () => {
  // // Hooks
  // const dispatch = useAppDispatch();
  // const state = useAppSelector((state) => state.slicerUploadFile);
  // const { response, status } = useAppSelector((state) => state.slicerSTLToGCode);

  // // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [layer, setLayer] = useState(1);

  // // Callbacks
  // const handleClick = () => {
  //   dispatch(fetchSTLToGCode(state.response.file as string));
  // };

  // // Handler for file input change
  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  // // Handler for button click
  // const handleUpload = () => {
  //   if (selectedFile) {
  //     dispatch(fetchUploadFile(selectedFile));
  //   } else {
  //     alert("Please select a file first.");
  //   }
  // };

  // const handleSliderChange = (e: Event, newValue: number | number[]) => {
  //   const formElement = e.target as HTMLFormElement;
  //   const name = formElement?.name as "layer";

  //   if (Array.isArray(newValue)) {
  //     return;
  //   }

  //   switch (name) {
  //     case "layer":
  //       setLayer(newValue);
  //   }
  // };

  // // JSX
  // const uploadSuccessJSX = state.status === Status.Succeeded && (
  //   <div>
  //     <p>Upload Succeeded: {state.response.file}</p>
  //     <button onClick={handleClick}>Slice</button>
  //     <PrintPreview
  //       stlUrl={state.response.file as string}
  //       gcodeUrl={response.file ? response.file : undefined}
  //     />
  //   </div>
  // );

  // const sliceSuccessJSX = status === Status.Succeeded && (
  //   <div>
  //     <p>Slice Succeeded: {response.file}</p>
  //     <Slider
  //       // disabled={processParametersStatus === Status.Idle}
  //       disableSwap
  //       name="layer"
  //       value={layer}
  //       valueLabelDisplay="auto"
  //       onChange={handleSliderChange}
  //       min={0}
  //       max={1}
  //       step={0.01}
  //     />
  //   </div>
  // )

  return (
    <div>
      <UploadedGCodeViewer />
      {/* <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadSuccessJSX}
      {sliceSuccessJSX} */}
    </div>
  )
};

export default Slicer 
