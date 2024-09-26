/**
 * Machines.tsx
 * Page component for displaying supported machines in tabular form.
 */

// Node Modules
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

// Components
import MachineSpecificationsTable from 'machine/SpecificationsTable';

const Machines: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Typography component="h2" variant="h4">
        Build Profiles
      </Typography>
      <MachineSpecificationsTable />
    </Box>
  );
};

export default Machines;
