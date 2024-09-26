/**
 * BuildProfile.tsx
 * Page component for creating new or editing existing build profile.
 */

// Node Modules
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { FC, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { reset, setBuildProfileForm } from 'build_profile/slice/form';

// API
import { deleteBuildProfile, getBuildProfile } from 'build_profile/_api';

// Components
import BuildProfileForm from 'build_profile/BuildProfileForm';

// Hooks
import { useAppSelector } from 'hooks';

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BuildProfile: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalIsShown, setModalIsShown] = useState(false);
  const buildProfile = useAppSelector((state) => state.buildProfileForm);

  useEffect(() => {
    // Retrieves project by id from API and updates redux store.
    const refreshBuildProfile = async () => {
      const { data } = await getBuildProfile(id);
      dispatch(setBuildProfileForm(data));
    };
    refreshBuildProfile();
  }, [dispatch]);

  // Callbacks
  const handleClick = async () => {
    const { response } = await deleteBuildProfile(id);
    if (response.status === 204) {
      navigate('/projects');
      dispatch(reset());
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          BuildProfile
        </Typography>
        <Button variant="contained" onClick={() => setModalIsShown(true)}>
          Delete
        </Button>
      </Box>
      <BuildProfileForm buildProfile={buildProfile} />
      <Modal
        closeAfterTransition
        onClose={() => setModalIsShown(false)}
        open={modalIsShown}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          }
        }}
      >
        <Fade in={modalIsShown}>
          <Box sx={style}>
            <Typography>
              Are you sure you would like to delete?
            </Typography>
            <Box sx={{ display: 'flex', gap: '1em'}}>
              <Button onClick={handleClick} variant="contained">Yes</Button>
              <Button
                onClick={() => setModalIsShown(false)}
                variant="contained"
              >
                No
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default BuildProfile;