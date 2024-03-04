/**
 * DataVisualization.tsx
 * Visualizes melt pool API response with charts and tables.
 */

// Node Modules
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// API
import { getClassificationRecords, getGeometryRecords } from './_api';

// Components
import Form from './Form';
import Chart from './Chart';
import DenseTable from 'common/Table';

// Constants
const COLUMN_NAMES = [
    'id',
    'power',
    'velocity',
    'material',
    'process',
    'sub_process',
    'hatch_spacing'
]

// Redux
import { RootState } from 'store';
import { setClassificationRecords } from './classificationRecordsSlice';
import { setGeometryRecords } from './geometryRecordsSlice';

// Types
import { RecordType } from './_enums';

interface Props {
    recordType: RecordType
}

const DataVisualization: FC<Props> = ({ recordType }) => {
    // Hooks
    const dispatch = useDispatch();
    const [showViz, setShowViz] = useState<boolean>(false);
    const geometryRecords = useSelector(
        (state: RootState) => state.meltPoolGeometryRecords
    );
    const classificationRecords = useSelector(
        (state: RootState) => state.meltPoolClassificationRecords
    );

    const [results, setResults] = useState<never[]>([]);

    useEffect(() => {
        // Changes records in chart and table components given record type.
        if (recordType === RecordType.Geometry) {
            setResults(geometryRecords.results)
        } else {
            setResults(classificationRecords.results)
        }
    }, [classificationRecords.results, geometryRecords.results, recordType])

    // TODO: Move this logic into `Form.tsx`
    const fetchData = async ({ 
        power, 
        velocity,
        material, 
        process, 
        hatchSpacing 
    }: { 
        power: number, 
        velocity: number,
        material: string, 
        process: string, 
        hatchSpacing: number }) => {
            if (recordType === RecordType.Geometry) {
                const data = await getGeometryRecords({
                    power: power,
                    velocity: velocity,
                    material: material,
                    process: process,
                    hatch_spacing: hatchSpacing
                });
                dispatch(setGeometryRecords(data));
            } else if (recordType === RecordType.Classification) {
                const data = await getClassificationRecords({
                    power: power,
                    velocity: velocity,
                    material: material,
                    process: process,
                    hatch_spacing: hatchSpacing
                });
                dispatch(setClassificationRecords(data));
            }
    };

    // TODO: Move this logic into `Form.tsx`
    const filterData = async () => {
        let power: any = (document.getElementById('power-input') as HTMLInputElement).value;
        if (power === '') {
            power = null;
        } else {
            power = Number(power);
        }
        let velocity: any = (document.getElementById('velocity-input') as HTMLInputElement).value;
        if (velocity === '') {
            velocity = null;
        } else {
            velocity = Number(velocity);
        }
        let hatchSpacing: any = (document.getElementById('hatch-input') as HTMLInputElement).value;
        if (hatchSpacing === '') {
            hatchSpacing = null;
        } else {
            hatchSpacing = Number(hatchSpacing);
        }
        let material:any = (document.getElementById('material-input') as HTMLInputElement).value;
        if (material === '') {
            material = null;
        }
        let process: any = (document.getElementById('process-input') as HTMLInputElement).value;
        if (process === '') {
            process = null;
        }

        await fetchData({ 
            power: power, 
            velocity: velocity,
            material: material, 
            process: process, 
            hatchSpacing: hatchSpacing 
        });

        setShowViz(true);
    };

    // JSX
    const chartJSX = showViz && (
        <Chart data={results} />
    );

    const tableJSX = showViz && (
        <DenseTable colNames={COLUMN_NAMES} rows={results} />
    );

    return (
        <Box
            display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
            <Form handler={filterData}/>
            <Box display="flex" justifyContent="center" alignItems="center">
                {chartJSX}
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
                {tableJSX}
            </Box>
        </Box>
    );
};

export default DataVisualization;
