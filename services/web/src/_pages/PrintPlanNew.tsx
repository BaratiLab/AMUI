/**
 * PrintPlanNew.tsx
 * Page component for creating new build profile.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

// Components
import PrintPlanForm from 'print_plan/PrintPlanForm';

const PrintPlanNew: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          New Print
        </Typography>
      </Box>
      <PrintPlanForm />
    </Box>
  );
};

export default PrintPlanNew;