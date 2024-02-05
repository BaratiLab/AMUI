/**
 * GeometryRecords.tsx
 * Development component to test out classifications records route.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { setGeometryRecords } from './geometryRecordsSlice';

// API
import { getGeometryRecords } from './api';

// Store
import { RootState } from 'store';

const GeometryRecords: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const geometries = useSelector((state: RootState) => state.meltPoolGeometryRecords);

  useEffect(() => {
    // Retrieves projects from API and updates redux store.
    const refreshProjects = async () => {
      const data = await getGeometryRecords({
        material: "IN718",
        process: "PBF",
        power: 140,
        velocity: 600
      });
      dispatch(setGeometryRecords(data));
    };
    refreshProjects();
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Geometry Records Response (Truncated)
        </Typography>
      </Box>
      <pre>
        {/* https://stackoverflow.com/a/17243919/10521456 */}
        {JSON.stringify(geometries.results[0], null, 2)}
      </pre>
    </Box>
  );
};

export default GeometryRecords;
