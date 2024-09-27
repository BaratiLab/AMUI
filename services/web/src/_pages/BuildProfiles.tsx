/**
 * BuildProfiles.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Button, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { readBuildProfiles } from 'build_profile/slice/list';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Components
import BuildProfileTable from 'build_profile/BuildProfileTable';

const BuildProfiles: FC = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data } = useAppSelector((state) => state.buildProfileList);

  useEffect(() => {
    dispatch(readBuildProfiles());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Build Profiles
        </Typography>
        <Button
          onClick={() => navigate('/build_profile/new')}
          variant="contained"
        >
          Create Build Profile
        </Button>
      </Box>
      <BuildProfileTable buildProfiles={data} />
    </Box>
  );
};

export default BuildProfiles;