/**
 * BuildProfileNew.tsx
 * Page component for creating new build profile.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

// Components
import BuildProfileForm from 'build_profile/BuildProfileForm';

const BuildProfileNew: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          New Build Profile
        </Typography>
      </Box>
      <BuildProfileForm />
    </Box>
  );
};

export default BuildProfileNew;