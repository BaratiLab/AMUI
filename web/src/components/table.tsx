import { FC } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const DenseTable: FC<{ colNames: Array<string>, rows: Array<Array<string>> }> = ({ colNames, rows }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">

                <TableHead>
                    <TableRow key={0}>
                        {colNames.slice(0, 10).map((colName, colIndex) => (     // TODO: fix horizontal scroll and remove `slice`
                            <TableCell key={colIndex}>{colName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.slice(0, 50).map((row, index) => (    // TODO: paginate to display all rows and remove `slice`
                        <TableRow
                            key={index + 1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {row.slice(0, 10).map((col, colIndex) => (     // TODO: fix horizontal scroll and remove `slice`
                                <TableCell key={colIndex}>{col}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default DenseTable;
