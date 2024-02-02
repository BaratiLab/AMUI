import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DenseTable from '../components/Table';
import Form from '../components/Form';
import Chart from './Chart';

const Viz: FC<{ meltpoolData: any }> = ({ meltpoolData }) => {
    const [colNames, setColNames] = useState<Array<string>>([]);
    const [rows, setRows] = useState<Array<Array<string>>>([]);
    const [showTable, setShowTable] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<any>([]);

    useEffect(() => {
        setColNames(Object.keys(meltpoolData[0]));
    }, [meltpoolData]);

    useEffect(() => {
        setRows(filteredData.map((row: any) => colNames.map((colName: string) => row[colName])));
    }, [filteredData]);


    const filterData = () => {
        // TODO: replace this function with api call when backend is ready
        // const power = Number((document.getElementById('power-input') as HTMLInputElement).value);
        // const velocity = Number((document.getElementById('velocity-input') as HTMLInputElement).value);
        setFilteredData(meltpoolData.filter((row: any) => row['Power'] >= 50 && row['Power'] <= 130 && row['Material'] == 'Ti-6Al-4V'));
        setShowTable(true);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
            <Form handler={filterData}/>
            <Box display="flex" justifyContent="center" alignItems="center">
                {
                    showTable &&
                    <Chart data={filteredData}/>
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
                {
                    showTable &&
                    <DenseTable colNames={colNames} rows={rows} />
                }
            </Box>
        </Box>
    );
};

export default Viz;
