/**
 * ClassificationRecords.tsx
 * Development component to test out classifications records route.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { setClassificationRecords } from './classificationRecordsSlice';

// API
import { getClassificationRecords } from './api';

// Store
import { RootState } from 'store';

const ClassificationRecords: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const classifications = useSelector((state: RootState) => state.meltPoolClassificationRecords);

  useEffect(() => {
    // Retrieves projects from API and updates redux store.
    const refreshProjects = async () => {
      const data = await getClassificationRecords({
        material: 'SS304L',
        power: 300,
        velocity: 2400,
      });
      dispatch(setClassificationRecords(data));
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
        {JSON.stringify(classifications.results[0], null, 2)}
      </pre>
    </Box>
  );
};

export default ClassificationRecords;
