/**
 * BuildProfile.tsx
 * Page component for creating new or editing existing build profile.
 */

// Node Modules
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { FC, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import {
  reset,
  readBuildProfile,
  deleteBuildProfile
} from 'build_profile/slice/detail';

// Components
import BuildProfileForm from 'build_profile/BuildProfileForm';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';
import { Status } from 'enums';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalIsShown, setModalIsShown] = useState(false);
  const {
    delete: {
      status: deleteStatus,
    },
    read: {
      status: readStatus,
    },
    data: buildProfile,
  } = useAppSelector((state) => state.buildProfileDetail);

  useEffect(() => {
    if (id) {
      // Retrieves data for specified build profile.
      dispatch(readBuildProfile(id));
    } else {
      // Navigate to build profile list page if invalid id is provided.
      navigate("/build_profile");
    }
  }, [dispatch, id, navigate]);

  useEffect(() => {
    // Redirects to list page if successfully deleted or non-existant.
    // TODO: Handle case where entry no longer exists
    // Redux status in this case still says successful, will need to rely on
    // server status code response.
    if (deleteStatus === Status.Succeeded) {
      navigate("/build_profile");

      // Reset build profile detail state.
      reset();
    }
  }, [deleteStatus, readStatus])

  // Callbacks
  const handleClick = async () => {
    dispatch(deleteBuildProfile(id as string));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Build Profile
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