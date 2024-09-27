/**
 * PrintPlan.tsx
 * Page component for creating new or editing existing build profile.
  //   // TODO: Handle case where entry no longer exists
  //   // Redux status in this case still says successful, will need to rely on
  //   // server status code response.
 */

// Node Modules
import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { readPrintPlan, deletePrintPlan } from 'print_plan/slice/detail';

// Components
import PrintPlanForm from 'print_plan/PrintPlanForm';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { PrintPlanDetailDeleteResponse } from 'print_plan/_types';

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

const PrintPlan: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalIsShown, setModalIsShown] = useState(false);

  const { data } = useAppSelector((state) => state.printPlanDetail);

  useEffect(() => {
    if (id) {
      // Retrieves data for specified print plan.
      dispatch(readPrintPlan(id));
    } else {
      // Navigate to print plan list page if invalid id is provided.
      navigate("/print_plan");
    }
  }, [dispatch, id, navigate]);

  // Callbacks
  const handleClick = async () => {
    const { payload } = await dispatch(deletePrintPlan(id as string));
    if ((payload as PrintPlanDetailDeleteResponse)?.code === 204 ) {
      navigate("/print_plan");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" sx={{ gap: '1em' }}>
          <IconButton onClick={() => navigate('/print_plan')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h2" variant="h4">
            Print
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setModalIsShown(true)}>
          Delete
        </Button>
      </Box>
      <PrintPlanForm printPlan={data} />
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

export default PrintPlan;