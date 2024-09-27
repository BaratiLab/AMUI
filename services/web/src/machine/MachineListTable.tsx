/**
 * MachineListTable.tsx
 * Table component for displaying and navigating machine specifications.
 */

// Node Modules
import { FC, useEffect } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Enums
import { Status } from "enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

// Actions
import { readMachines } from "machine/slice/list";

const MachineListTable: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();

  const { read, data } = useAppSelector((state) => state.machineList);

  useEffect(() => {
    // Retrieves list of machines
    if (read.status === Status.Idle) {
      dispatch(readMachines());
    }
  }, [dispatch, read.status]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="machine specifications table">
        <TableHead>
          <TableRow>
            <TableCell>Machine Name</TableCell>
            <TableCell>Company</TableCell>
            <TableCell align="left" colSpan={2}>Power (W)</TableCell>
            <TableCell align="left" colSpan={2}>Velocity (m/s)</TableCell>
            <TableCell align="left" colSpan={2}>Spot Size (µm)</TableCell>
            <TableCell>Laser Type</TableCell>
            <TableCell align="left" colSpan={2}>Layer Thickness (µm)</TableCell>
            <TableCell>Technical Data Sheet</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Min</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Min</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Min</TableCell>
            <TableCell>Max</TableCell>
            <TableCell></TableCell>
            <TableCell>Min</TableCell>
            <TableCell>Max</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell>{row.company}</TableCell>
              <TableCell>{row.power_min_w}</TableCell>
              <TableCell>{row.power_max_w}</TableCell>
              <TableCell>{row.velocity_min_m_per_s}</TableCell>
              <TableCell>{row.velocity_max_m_per_s}</TableCell>
              <TableCell>{row.spot_size_min_microns}</TableCell>
              <TableCell>{row.spot_size_max_microns}</TableCell>
              <TableCell>{row.laser_type}</TableCell>
              <TableCell>{row.layer_thickness_min_microns}</TableCell>
              <TableCell>{row.layer_thickness_max_microns}</TableCell>
              <TableCell>
                <Link
                  href={row.tds_link}
                  underline='hover'
                  target='_blank'
                  rel='noreferrer'
                  sx={{
                    display: 'inline-block',
                    maxWidth: '200px', // Set your desired max-width
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {row.tds_link || ''}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MachineListTable;
