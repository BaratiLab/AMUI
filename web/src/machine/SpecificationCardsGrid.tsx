/**
 * SpecificationCardsGrid.tsx
 * Loads machine specification cards within a grid layout.
 */

// Node Modules
import { Button, Grid } from '@mui/material';
import { FC, useState } from 'react';

// Components
import MachineSpecificationCard from 'machine/SpecificationCard';

// Constants
const INITIAL_SHOW_LIMIT = 6;

// Hooks
import { useSpecifications } from 'machine/_hooks';

// Enums
import { Status } from 'enums';

const SpecificationCardsGrid: FC = () => {
  // Hooks
  const [limit, setLimit] = useState(INITIAL_SHOW_LIMIT);
  const [{
    data: machineSpecificationsData,
    status: machineSpecificationsStatus
  }] = useSpecifications();

  // Callbacks
  const handleClick = () => {
    length = machineSpecificationsData.length;
    setLimit((prevState) => prevState === length ? INITIAL_SHOW_LIMIT : length);
  };

  // JSX
  const machineSpecificationsJSX =
    machineSpecificationsStatus === Status.Succeeded &&
    machineSpecificationsData
      .filter((_, index) => index < limit)
      .map(
        (specification) => (
          <Grid key={specification.id} item xs={2} sm={4} md={4}>
            <MachineSpecificationCard specification={specification}/>
          </Grid>
        )
      );

  const showMoreButtonJSX = limit === INITIAL_SHOW_LIMIT && (
    <Grid item xs={2} sm={4} md={4}>
      <Button onClick={handleClick}>Show More</Button>
    </Grid>
  );

  return (
    <Grid container spacing={{ xs: 2, md: 3}} columns={{ xs: 4, sm: 8, md: 12}}>
      {machineSpecificationsJSX}
      {showMoreButtonJSX}
    </Grid>
  );
};

export default SpecificationCardsGrid;
