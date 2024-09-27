/**
 * Parts.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Button, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
// import { readParts } from 'build_profile/slice/list';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Components
// import PartTable from 'build_profile/PartTable';

const Parts: FC = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const { data } = useAppSelector((state) => state.buildProfileList);

  // useEffect(() => {
  //   dispatch(readParts());
  // }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Parts
        </Typography>
        <Button
          onClick={() => navigate('/part/new')}
          variant="contained"
        >
          Upload Part
        </Button>
      </Box>
      {/* <PartTable buildProfiles={data} /> */}
    </Box>
  );
};

export default Parts;