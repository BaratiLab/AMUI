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
                        {colNames.map((colName, colIndex) => (
                            <TableCell key={colIndex}>{colName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index + 1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {row.map((col, colIndex) => (
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
