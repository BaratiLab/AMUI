/**
 * Slicer.tsx
 * test page for slicer 
 */

// Node Modules
import { FC } from 'react';

// Components
import UploadedGCodeViewer from "slicer/UploadedGCodeViewer";
import Chart from "slicer/HighchartsScatterPlot";

const Slicer: FC = () => (
  <div>
    <UploadedGCodeViewer />
    <Chart />
  </div>
);

export default Slicer 
