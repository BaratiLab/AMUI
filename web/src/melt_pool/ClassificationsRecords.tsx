/**
 * ClassificationRecords.tsx
 * Development component to test out classifications records route.
 */

// Node Modules
import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { setClassificationRecords } from './classificationRecordsSlice';

// API
import { getClassificationRecords } from './api';

// Components
// import ProjectsTable from './ProjectsTable';

// Store
import { RootState } from 'store';

const ClassificationRecords: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classifications = useSelector((state: RootState) => state.meltPoolClassificationRecords);

  useEffect(() => {
    // Retrieves projects from API and updates redux store.
    const refreshProjects = async () => {
      const data = await getClassificationRecords();
      dispatch(setClassificationRecords(data));
    };
    refreshProjects();
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Classification Records
        </Typography>
      </Box>
      {/* <ProjectsTable projects={projects.results} /> */}
    </Box>
  );
};

export default ClassificationRecords;
