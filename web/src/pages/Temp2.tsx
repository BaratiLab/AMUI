import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DenseTable from '../components/Table';
// @ts-ignore
import meltpoolGeo from "../meltpoolgeometry.csv";

const Temp2: FC = () => {
    const [ colNames, setColNames ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        setColNames(Object.keys(meltpoolGeo[0]));
    }, [meltpoolGeo]);

    useEffect(() => {
        setRows(meltpoolGeo.map((row: any) => colNames.map((colName: string) => row[colName])));
    }, [colNames]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <div>
                <DenseTable colNames={colNames} rows={rows} />
            </div>
        </Box>
    );
};

export default Temp2;
