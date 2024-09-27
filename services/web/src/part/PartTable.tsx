/**
 * PartsTable.tsx
 * Table component for displaying part and details
 */

// Node Modules
import { FC } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Types
import { PartResponse } from 'part/_types';

const PartTableRow: FC<{part: PartResponse}> = ({ part }) => {
  // Hooks
  const navigate = useNavigate();
  const createdOn = new Date(part.created_on as string);
  const updatedOn = new Date(part.updated_on as string);
  const option: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <TableRow
      hover
      onClick={() => navigate(`/part/${part.id}`)}
      sx={{ '&:last-child td, &:last-child th': { border: 0}}}
    >
      <TableCell component="th" scope="row">
        {part.name}
      </TableCell>
      <TableCell align="right">
        {createdOn.toLocaleDateString("en-US", option)}
      </TableCell>
      <TableCell align="right">
        {updatedOn.toLocaleDateString("en-US", option)}
      </TableCell>
    </TableRow>
  );
}

const PartsTable: FC<{parts: PartResponse[]}> = ({ parts }) => {
  // JSX
  const tableRowsJSX = parts.map((part) => (
    <PartTableRow key={part.id} part={part} />
  ));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="part table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Last Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRowsJSX}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PartsTable;
