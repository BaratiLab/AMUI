/**
 * PartNew.tsx
 * Page component for creating new build profile.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

// Components
// import PartForm from 'build_profile/PartForm';

const PartNew: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Upload New Part
        </Typography>
      </Box>
      {/* <PartForm /> */}
    </Box>
  );
};

export default PartNew;