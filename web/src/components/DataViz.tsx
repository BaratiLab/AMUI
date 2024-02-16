import { FC, useState } from 'react';
import { Box } from '@mui/material';
import Form from './Form';
import Chart from './Chart';
import DenseTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setClassificationRecords } from '../melt_pool/classificationRecordsSlice';
import { getClassificationRecords } from '../melt_pool/api';
import { setGeometryRecords } from '../melt_pool/geometryRecordsSlice';
import { getGeometryRecords } from '../melt_pool/api';

const Viz: FC<{ clsgeo: string }> = ({ clsgeo }) => {
    const [showViz, setShowViz] = useState<boolean>(false);

    const dispatch = useDispatch();
    let meltPoolData: any;
    if (clsgeo === 'geo') {
        meltPoolData = useSelector((state: RootState) => state.meltPoolGeometryRecords);
    } else if (clsgeo === 'cls') {
        meltPoolData = useSelector((state: RootState) => state.meltPoolClassificationRecords);
    }

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
            if (clsgeo === 'geo') {
                const data = await getGeometryRecords({
                    power: power,
                    velocity: velocity,
                    material: material,
                    process: process,
                    hatch_spacing: hatchSpacing
                });
                dispatch(setGeometryRecords(data));
            } else if (clsgeo === 'cls') {
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

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
            <Form handler={filterData}/>
            <Box display="flex" justifyContent="center" alignItems="center">
                {
                    showViz &&
                    <Chart data={meltPoolData.results}/>
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
                {
                    showViz &&
                    <DenseTable colNames={['id', 'power', 'velocity', 'material', 'process', 'sub_process', 'hatch_spacing']} rows={meltPoolData.results} />
                }
            </Box>
        </Box>
    );
};

export default Viz;
