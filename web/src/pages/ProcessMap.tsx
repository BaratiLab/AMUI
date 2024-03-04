/**
 * ProcessMap.tsx
 * Page component to display process map.
 */

// Node Modules
import { Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';

// Actions
import { fetchProcessParameters } from 'melt_pool/processParametersSlice';

// Components
import DataVisualization from 'melt_pool/DataVisualization';
import ClassificationRecordsForm from 'melt_pool/ClassificationRecordsForm';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { RecordType } from 'melt_pool/_enums';

const ProcessMap: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const [recordType, setRecordType] = useState(RecordType.Geometry);
  const { status } = useAppSelector(state => state.meltPoolProcessParameters);

  useEffect(() => {
    // Retreives available process parameters from backend.
    if (status === Status.Idle) {
      dispatch(fetchProcessParameters());
    }
  }, [status]);

  // Callbacks
  const handleClick = (recordType: RecordType) => {
    setRecordType(recordType);
  };

  return (
    <div>
      <Button
        disabled={recordType === RecordType.Geometry}
        onClick={() => handleClick(RecordType.Geometry)}
      >
        Geometry
      </Button>
      <Button
        disabled={recordType === RecordType.Classification}
        onClick={() => handleClick(RecordType.Classification)}
      >
        Classification 
      </Button>
      <ClassificationRecordsForm />
      <DataVisualization recordType={recordType} />
    </div>
  );
}

export default ProcessMap;
