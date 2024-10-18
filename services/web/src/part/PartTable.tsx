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
import { PartListResponse } from 'part/_types';

const PartTableRow: FC<{part: PartListResponse}> = ({ part }) => {
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
      sx={{
        '&:last-child td, &:last-child th': { border: 0},
        '&:hover': { cursor: "pointer"},
      }}
    >
      <TableCell align="center" component="th" scope="row">
        <img
          height={50}
          loading="lazy"
          src={part.part_file.thumbnail}
          width={50}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {part.name}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        {part.part_files.length}
      </TableCell>
      <TableCell align="right">
        {updatedOn.toLocaleDateString("en-US", option)}
      </TableCell>
      <TableCell align="right">
        {createdOn.toLocaleDateString("en-US", option)}
      </TableCell>
    </TableRow>
  );
}

const PartsTable: FC<{parts: PartListResponse[]}> = ({ parts }) => {
  // JSX
  const tableRowsJSX = parts.map((part) => (
    <PartTableRow key={part.id} part={part} />
  ));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="part table">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>{"Variation(s)"}</TableCell>
            <TableCell align="right">Last Updated</TableCell>
            <TableCell align="right">Created</TableCell>
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
