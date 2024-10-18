/**
 * Overview.tsx
 * Page component general dashboard overview 
 */

// Node Modules
import { FC } from 'react';
import { Typography } from '@mui/material';

// Components
import PartFileDropzone from 'part/PartFileDropzone';

const Overview: FC = () => {
  return (
    <>
      <Typography variant="h3">
        Overview 
      </Typography>
      <PartFileDropzone />
    </>
  );
};

export default Overview;
