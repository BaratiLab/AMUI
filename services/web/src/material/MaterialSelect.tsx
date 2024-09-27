/**
 * MaterialSelect.tsx
 * Select input component for selecting material.
 */

// Node Modules
import { FC, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Actions
import { readMaterials } from 'material/slice/list';

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

const MaterialSelect: FC<Props> = ({ value, onChange, name = "material" }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data, read } = useAppSelector((state) => state.materialList)

  useEffect(() => {
    if (read.status === Status.Idle) {
      dispatch(readMaterials());
    }
  }, [dispatch, read.status]);

  // JSX
  const materialMenuItemsJSX = data.map((material) => (
    <MenuItem value={material.id}>{material.name}</MenuItem>
  ));

  return (
    <FormControl>
      <InputLabel>Material</InputLabel>
      <Select name={name} value={value?.toString() || ""} onChange={onChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {materialMenuItemsJSX}
      </Select>
    </FormControl>
  );
}

export default MaterialSelect;
