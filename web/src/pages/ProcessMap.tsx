/**
 * ProcessMap.tsx
 * Page component to display process map.
 */

// Node Modules
import { Button } from '@mui/material';
import { FC, useState } from 'react';

// Components
import DataVisualization from 'melt_pool/DataVisualization';
import ClassificationRecordsForm from 'melt_pool/ClassificationRecordsForm';

// Types
import { RecordType } from 'melt_pool/_enums';

const ProcessMap: FC = () => {
    // Hooks
    const [recordType, setRecordType] = useState(RecordType.Geometry);

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
