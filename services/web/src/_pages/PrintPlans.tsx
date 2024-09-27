/**
 * PrintPlans.tsx
 * Main page component for navigating through build profiles.
 */

// Node Modules
import { Box, Button, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { readPrintPlans } from 'print_plan/slice/list';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Components
import PartTable from 'print_plan/PrintPlanTable';

const PrintPlans: FC = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data } = useAppSelector((state) => state.printPlanList);

  useEffect(() => {
    dispatch(readPrintPlans());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h4">
          Prints
        </Typography>
        <Button
          onClick={() => navigate('/print_plan/new')}
          variant="contained"
        >
          New Print
        </Button>
      </Box>
      <PartTable printPlans={data} />
    </Box>
  );
};

export default PrintPlans;