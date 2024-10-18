/**
 * PartSelect.tsx
 * Select input component for selecting material.
 */

// Node Modules
import { FC, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Actions
import { readParts } from 'part/slice/partList';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Enums
import { Status } from 'enums';

// Type
interface Props {
  value: number | null;
  onChange: (e: SelectChangeEvent) => void;
  name?: string;
}

const PartSelect: FC<Props> = ({ value, onChange, name = "part_id" }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data, read } = useAppSelector((state) => state.partList)

  useEffect(() => {
    if (read.status === Status.Idle) {
      dispatch(readParts());
    }
  }, [dispatch, read.status]);

  // JSX
  const menuItemsJSX = data.map((part) => (
    <MenuItem value={part.id}>{part.name}</MenuItem>
  ));

  return (
    <FormControl>
      <InputLabel>Part</InputLabel>
      <Select name={name} value={value?.toString() || ""} onChange={onChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {menuItemsJSX}
      </Select>
    </FormControl>
  );
}

export default PartSelect;
