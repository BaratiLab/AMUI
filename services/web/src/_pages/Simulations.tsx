/**
 * Simulations.tsx
 * Page component for managing simulations.
 */

// Node Modules
import { FC } from 'react';
import { Typography } from '@mui/material';

// Components
import TestTaskForm from 'flow3d/TestTaskForm'

const Simulations: FC = () => {
  return (
    <>
      <Typography variant="h3">
        Simulations
      </Typography>
      <TestTaskForm />
    </>
  );
};

export default Simulations;
