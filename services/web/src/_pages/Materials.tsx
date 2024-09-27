/**
 * Materials.tsx
 * Page component for displaying supported materials in tabular form.
 */

// Node Modules
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

// Components
import MaterialListTable from 'material/MaterialListTable';

const Materials: FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
    <Typography component="h2" variant="h4">
      Materials
    </Typography>
    <MaterialListTable />
  </Box>
);

export default Materials;
