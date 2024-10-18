/**
 * Parts.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';

// Actions
import { readParts } from 'part/slice/partList';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Components
import PartTable from 'part/PartTable';
import PartFileDropzone from 'part/PartFileDropzone';

const Parts: FC = () => {
  // Hooks
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
      </Box>
      <PartFileDropzone />
      <PartTable parts={data} />
    </Box>
  );
};

export default Parts;