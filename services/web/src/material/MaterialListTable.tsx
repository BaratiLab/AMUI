/**
 * MaterialListTable.tsx
 * Table component for displaying and navigating machine specifications.
 */

// Node Modules
import { FC, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Actions
import { readMaterials } from 'material/slice/list';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

const MaterialListTable: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data, read } = useAppSelector((state) => state.materialList)

  useEffect(() => {
    if (read.status === Status.Idle) {
      dispatch(readMaterials());
    }
  }, [dispatch, read.status]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="machine specifications table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>UNS</TableCell>
            <TableCell align="left" colSpan={2}>Temperature (K)</TableCell>
            <TableCell>Density</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Liquidus</TableCell>
            <TableCell>Solidus</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.uns_id}</TableCell>
              <TableCell>{row.solidus_temperature_K}</TableCell>
              <TableCell>{row.liquidus_temperature_K}</TableCell>
              <TableCell>{row.density_g_cm_3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaterialListTable;
