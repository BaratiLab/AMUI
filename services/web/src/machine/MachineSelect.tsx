/**
 * MachineSelect.tsx
 * Select input component for selecting material.
 */

// Node Modules
import { FC, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Actions
import { readMachines } from 'machine/slice/list';

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

const MachineSelect: FC<Props> = ({ value, onChange, name = "machine_id" }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data, read } = useAppSelector((state) => state.machineList)

  useEffect(() => {
    if (read.status === Status.Idle) {
      dispatch(readMachines());
    }
  }, [dispatch, read.status]);

  // JSX
  const menuItemsJSX = data.map((machine) => (
    <MenuItem value={machine.id}>{machine.name}</MenuItem>
  ));

  return (
    <FormControl>
      <InputLabel>Machine</InputLabel>
      <Select name={name} value={value?.toString() || ""} onChange={onChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {menuItemsJSX}
      </Select>
    </FormControl>
  );
}

export default MachineSelect;
