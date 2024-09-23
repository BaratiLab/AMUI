/**
 * Machines.tsx
 * Page component for displaying supported machines in tabular form.
 */

// Node Modules
import { FC } from 'react';
import { Typography } from '@mui/material';

// Components
import MachineSpecificationsTable from 'machine/SpecificationsTable';

const Machines: FC = () => {
  return (
    <>
      <Typography variant="h3" sx={{"marginBottom": "10px"}}>
        Machines
      </Typography>
      <MachineSpecificationsTable />
    </>
  );
};

export default Machines;
