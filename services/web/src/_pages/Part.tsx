/**
 * Part.tsx
 * Page component for creating new or editing existing build profile.
 */

// Node Modules
import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { readPart, deletePart } from 'part/slice/partDetail';

// Components
import PartForm from 'part/PartForm';
import PartFileDropzone from 'part/PartFileDropzone';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { PartDetailDeleteResponse } from 'part/_types';

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

const Part: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalIsShown, setModalIsShown] = useState(false);

  const { data } = useAppSelector((state) => state.partDetail);

  useEffect(() => {
    if (id) {
      // Retrieves data for specified build profile.
      dispatch(readPart(id));
    } else {
      // Navigate to build profile list page if invalid id is provided.
      navigate("/part");
    }
  }, [dispatch, id, navigate]);

  // Callbacks
  const handleClick = async () => {
    const { payload } = await dispatch(deletePart(id as string));
    if ((payload as PartDetailDeleteResponse)?.code === 204 ) {
      navigate("/part");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" sx={{ gap: '1em' }}>
          <IconButton onClick={() => navigate('/part')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h2" variant="h4">
            Part
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setModalIsShown(true)}>
          Delete
        </Button>
      </Box>
      <PartFileDropzone part={data} />
      <PartForm part={data} />
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

export default Part;