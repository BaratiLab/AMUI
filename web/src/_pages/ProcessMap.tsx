/**
 * ProcessMap.tsx
 * Page component to display process map.
 */

// Node Modules
import { Box } from '@mui/material';
import { FC } from 'react';

// Components
import Chart from 'process_map/Chart';
import Table from 'melt_pool/Table';
import RecordsForm from 'melt_pool/RecordsForm';

// Constants
const COLUMN_NAMES = [
    'id',
    'power',
    'velocity',
    'material',
    'process',
    'sub_process',
    'hatch_spacing'
];

// Enums
import { Status } from 'enums';

// Hooks
import { useRecords } from 'melt_pool/_hooks';

const ProcessMap: FC = () => {
  // Hooks
  const [{data: recordsData, status: recordsStatus}] = useRecords();

  // JSX
  const chartJSX = recordsStatus ===  Status.Succeeded && (
      <Chart data={recordsData} />
  );

  const tableJSX = recordsStatus ===  Status.Succeeded && (
      <Table colNames={COLUMN_NAMES} rows={recordsData} />
  );

  return (
    <Box display="flex" alignItems="center" minHeight="80vh" flexDirection="column">
      <RecordsForm />
      <Box display="flex" justifyContent="center" alignItems="center">
          {chartJSX}
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
          {tableJSX}
      </Box>
    </Box>
  );
}

export default ProcessMap;
