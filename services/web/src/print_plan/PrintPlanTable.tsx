/**
 * PrintPlansTable.tsx
 * Table component for displaying printPlan and details
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
import { PrintPlanListResponse } from 'print_plan/_types';

const PrintPlanTableRow: FC<{printPlan: PrintPlanListResponse}> = ({ printPlan }) => {
  // Hooks
  const navigate = useNavigate();
  const createdOn = new Date(printPlan.created_on as string);
  const updatedOn = new Date(printPlan.updated_on as string);
  const option: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <TableRow
      hover
      onClick={() => navigate(`/print_plan/${printPlan.id}`)}
      sx={{
        '&:last-child td, &:last-child th': { border: 0},
        '&:hover': { cursor: "pointer"},
      }}
    >
      <TableCell align="center" component="th" scope="row">
        <img
          height={50}
          loading="lazy"
          src={printPlan.part?.part_file.thumbnail}
          width={50}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {printPlan.name}
      </TableCell>
      <TableCell align="left">
        {printPlan.build_profile_title || "No Profile"}
      </TableCell>
      <TableCell align="left">
        {printPlan.build_profile_material_name || "No Material"}
      </TableCell>
      <TableCell align="left">
        {printPlan.part?.name || "No Part"}
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

const PrintPlansTable: FC<{printPlans: PrintPlanListResponse[]}> = ({ printPlans }) => {
  // JSX
  const tableRowsJSX = printPlans.map((printPlan) => (
    <PrintPlanTableRow key={printPlan.id} printPlan={printPlan} />
  ));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="print_plan table">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="left">Profile</TableCell>
            <TableCell align="left">Material</TableCell>
            <TableCell align="left">Part</TableCell>
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

export default PrintPlansTable;
