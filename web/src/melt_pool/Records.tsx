/**
 * MeltPoolRecords.tsx
 * Development component to test out classifications records route.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';

// Actions
import { setRecords } from './recordsSlice';

// API
import { getRecords } from './_api';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Store
import { RootState } from 'store';

const Records: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state: RootState) => state.meltPoolRecords);

  useEffect(() => {
    // Retrieves projects from API and updates redux store.
    const refreshProjects = async () => {
      const data = await getRecords({
        material: 'SS304L',
        power: 300,
        velocity: 2400,
      });
      dispatch(setRecords(data));
    };
    refreshProjects();
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Classification Records Response (Truncated)
        </Typography>
      </Box>
      <pre>
        {/* https://stackoverflow.com/a/17243919/10521456 */}
        {JSON.stringify(data.results[0], null, 2)}
      </pre>
    </Box>
  );
};

export default Records;
