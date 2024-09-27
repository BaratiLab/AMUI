/**
 * Machines.tsx
 * Page component for displaying supported machines in tabular form.
 */

// Node Modules
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

// Components
import MachineListTable from 'machine/MachineListTable';

const Machines: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Typography component="h2" variant="h4">
        Machines
      </Typography>
      <MachineListTable />
    </Box>
  );
};

export default Machines;
