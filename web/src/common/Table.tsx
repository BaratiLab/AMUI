import { FC, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    Typography
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const DenseTable: FC<{ colNames: Array<string>, rows: Array<object> }> = ({ colNames, rows }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
   
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">

                <TableHead>
                    <TableRow>
                        {colNames.map((colName, colIndex) => (
                            <TableCell key={colIndex}>{colName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: { [key: string]: any }, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {colNames.map((col, colIndex) => (
                                <TableCell key={colIndex}>{row[col]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            <div style={{ display: 'flex', justifyContent: 'center' , color:'black', height: '10px'}}>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
               
            />
             </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' , color:'black', height: '25px'}}>
                <Typography variant="body2">
                    Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
                </Typography>
                <IconButton
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton
                    onClick={() => setPage((prev) => (prev + 1))}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </div>
        </TableContainer>
    );
};

export default DenseTable;
