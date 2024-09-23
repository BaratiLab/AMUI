/**
 * Materials.tsx
 * Page component for displaying supported materials in tabular form.
 */

// Node Modules
import { FC } from 'react';
import { Typography } from '@mui/material';

// Components
import MaterialListTable from 'material/MaterialListTable';

const Materials: FC = () => {
  return (
    <>
      <Typography variant="h3" sx={{"marginBottom": "10px"}}>
        Materials
      </Typography>
      <MaterialListTable />
    </>
  );
};

export default Materials;
