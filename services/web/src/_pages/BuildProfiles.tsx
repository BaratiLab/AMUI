/**
 * BuildProfiles.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
// import { setProjects } from './projectsSlice';

// API
// import { getProjects } from './api';

// Components
// import ProjectsTable from './ProjectsTable';

const BuildProfiles: FC = () => {
  // Hooks
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Retrieves projects from API and updates redux store.
  //   const refreshProjects = async () => {
  //     const data = await getProjects();
  //     dispatch(setProjects(data));
  //   };
  //   refreshProjects();
  // }, [dispatch]);

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
      {/* <ProjectsTable projects={projects.results} /> */}
    </Box>
  );
};

export default BuildProfiles;