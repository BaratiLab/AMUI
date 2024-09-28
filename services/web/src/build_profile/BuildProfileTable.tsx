/**
 * BuildProfilesTable.tsx
 * Table component for displaying buildProfile and details
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
import { BuildProfileListResponse } from 'build_profile/_types';

const BuildProfileTableRow: FC<{buildProfile: BuildProfileListResponse}> = ({ buildProfile }) => {
  // Hooks
  const navigate = useNavigate();
  const createdOn = new Date(buildProfile.created_on as string);
  const updatedOn = new Date(buildProfile.updated_on as string);
  const option: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <TableRow
      hover
      onClick={() => navigate(`/build_profile/${buildProfile.id}`)}
      sx={{ '&:last-child td, &:last-child th': { border: 0}}}
    >
      <TableCell component="th" scope="row">
        {buildProfile.title}
      </TableCell>
      <TableCell align="left">
        {buildProfile.material_name || "No Material"}
      </TableCell>
      <TableCell align="left">
        {buildProfile.machine_name || "No Machine"}
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

const BuildProfilesTable: FC<{buildProfiles: BuildProfileListResponse[]}> = ({ buildProfiles }) => {
  // JSX
  const tableRowsJSX = buildProfiles.map((buildProfile) => (
    <BuildProfileTableRow key={buildProfile.id} buildProfile={buildProfile} />
  ));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="build_profile table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">Material</TableCell>
            <TableCell align="left">Machine</TableCell>
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

export default BuildProfilesTable;
