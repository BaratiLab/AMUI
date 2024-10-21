/**
 * BuildProfileSelect.tsx
 * Select input component for selecting material.
 */

// Node Modules
import { FC, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Actions
import { readBuildProfiles } from 'build_profile/slice/list';

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

const BuildProfileSelect: FC<Props> = ({ value, onChange, name = "build_profile_id" }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const { data, read } = useAppSelector((state) => state.buildProfileList)

  useEffect(() => {
    if (read.status === Status.Idle) {
      dispatch(readBuildProfiles());
    }
  }, [dispatch, read.status]);

  // JSX
  const menuItemsJSX = data.map((buildProfile) => (
    <MenuItem value={buildProfile.id}>{buildProfile.name}</MenuItem>
  ));

  return (
    <FormControl>
      <InputLabel>Build Profile</InputLabel>
      <Select name={name} value={value?.toString() || ""} onChange={onChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {menuItemsJSX}
      </Select>
    </FormControl>
  );
}

export default BuildProfileSelect;
