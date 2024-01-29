import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DenseTable from '../components/table';
// @ts-ignore
import meltpoolCls from "../meltpoolclassification.csv";

const Temp3: FC = () => {
    const [ colNames, setColNames ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        setColNames(Object.keys(meltpoolCls[0]));
    }, [meltpoolCls]);

    useEffect(() => {
        setRows(meltpoolCls.map((row: any) => colNames.map((colName: string) => row[colName])));
    }, [colNames]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <div>
                <DenseTable colNames={colNames} rows={rows} />
            </div>
        </Box>
    );
};

export default Temp3;
