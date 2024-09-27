/**
 * Parts.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Button, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { readParts } from 'part/slice/list';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Components
import PartTable from 'part/PartTable';

const Parts: FC = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data } = useAppSelector((state) => state.partList);

  useEffect(() => {
    dispatch(readParts());
  }, [dispatch]);

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
          New Part
        </Button>
      </Box>
      <PartTable parts={data} />
    </Box>
  );
};

export default Parts;