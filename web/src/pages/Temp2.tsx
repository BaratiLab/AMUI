import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import * as Papa from 'papaparse';
import DenseTable from '../components/table';
// @ts-ignore
import meltpoolGeo from "../meltpoolgeometry.csv";

const Temp2: FC = () => {
    const [ colNames, setColNames ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        fetch( meltpoolGeo )
            .then( response => response.text() )
            .then( responseText => {
                const data = Papa.parse(responseText);
                setColNames( data.data[0] as string[] );
                setRows( data.data.slice(1, 50) as string[][] );    // TODO: paginate to display all rows
            });
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <div>
                <DenseTable colNames={colNames} rows={rows} />
            </div>
        </Box>
    );
};

export default Temp2;
