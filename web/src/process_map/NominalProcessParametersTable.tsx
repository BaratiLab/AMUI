/**
 * NominalProcessParametersTable.tsx
 * Table for displaying nominal process parameters.
 */

// Node Modules
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

// Hooks 
import { useAppSelector } from 'hooks';

// Types
import { ProcessParameters } from './_types';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  console.log(a, b, orderBy)
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProcessParameters;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'velocity',
    numeric: true,
    disablePadding: true,
    label: 'Velocity (mm/s)',
  },
  {
    id: 'power',
    numeric: true,
    disablePadding: false,
    label: 'Power (W)',
  },
  {
    id: 'hatchSpacing',
    numeric: true,
    disablePadding: false,
    label: 'Hatch Spacing (μm)',
  },
  {
    id: 'layerThickness',
    numeric: true,
    disablePadding: false,
    label: 'Layer Thickness (μm)',
  },
];

export default function EnhancedTable() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof ProcessParameters>('velocity');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { nominalProcessParameters } = useAppSelector((state) => state.processMapConfiguration);

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof ProcessParameters,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows: number = useMemo(() => Math.max(
    0, (1 + page) * rowsPerPage - nominalProcessParameters.length
  ), [page, rowsPerPage, nominalProcessParameters])

  const visibleRows: ProcessParameters[] = useMemo(
    () => {
      const sortedNominalProcessParameters = nominalProcessParameters
        .toSorted(getComparator(order, orderBy))
        .slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        );
      return sortedNominalProcessParameters
    },
    [order, orderBy, page, rowsPerPage, nominalProcessParameters],
  );

  const createSortHandler =
    (property: keyof ProcessParameters) => (event: MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  // JSX
  const emptyRowsJSX = emptyRows > 0 && (
    <TableRow style={{ height: 33 * emptyRows }}>
      <TableCell colSpan={6} />
    </TableRow>
  );

  const visibleRowsJSX = visibleRows.map((row, index) => (
      <TableRow hover tabIndex={-1} key={index}>
        <TableCell align="right">{row.velocity}</TableCell>
        <TableCell align="right">{row.power}</TableCell>
        <TableCell align="right">{row.hatchSpacing}</TableCell>
        <TableCell align="right">{row.layerThickness}</TableCell>
      </TableRow>
    )
  );

  const headCellsJSX = headCells.map((headCell) => (
    <TableCell
      key={headCell.id}
      align={headCell.numeric ? 'right' : 'left'}
      padding={headCell.disablePadding ? 'none' : 'normal'}
      sortDirection={orderBy === headCell.id ? order : false}
    >
      <TableSortLabel
        active={orderBy === headCell.id}
        direction={orderBy === headCell.id ? order : 'asc'}
        onClick={createSortHandler(headCell.id)}
      >
        {headCell.label}
      </TableSortLabel>
    </TableCell>
  ));

  return (
    <Box>
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
        Nominal Parameters 
      </Typography>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size='small'>
          <TableHead>
            <TableRow>
              {headCellsJSX}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRowsJSX}
            {emptyRowsJSX}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={nominalProcessParameters.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}