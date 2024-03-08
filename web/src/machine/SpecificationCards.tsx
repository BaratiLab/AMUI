/**
 * SpecificationsPanel.tsx
 * Component for selecting machine specifications.
 */

// Node Modules
import { FC } from 'react';
import { Box } from '@mui/material';

// Hooks
import { useSpecifications } from 'machine/_hooks';
import { Status } from 'enums';

const SpecificationsForm: FC = () => {
  // Hooks
  const [{data, status}] = useSpecifications();

  // JSX
  const machineSpecificationsJSX = status === Status.Succeeded && data.map(
    (machineSpecification) => <div>{machineSpecification.machine}</div>
  )

  return (
    <Box display="flex">
      {machineSpecificationsJSX}
    </Box>
  );
};

export default SpecificationsForm;
