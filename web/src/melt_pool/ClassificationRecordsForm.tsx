/**
 * ClassificationRecordsForm.tsx
 * Form component for retrieving classification records.
 */

// Node Modules
import { ChangeEvent, FC, useState } from 'react';
import { 
  Box, 
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

// Constants
const REQUEST = {
  material: undefined,
  power: 0,
  velocity: 0,
}

// Enums
import { Material } from './_enums';

const ClassificationRecordsForm: FC = () => {
  // Hooks
  const [request, setRequest] = useState(REQUEST);

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const{ name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // TODO: Findout how to fix `SelectChangeEvent<HTMLSelectElement>` type to
  // remove redundant code.
  const handleSelect = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const{ name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  // JSX
  const materialsJSX = Object.entries(Material).map(([key, value]) => (
    <MenuItem key={key} value={value}>{value}</MenuItem>
  ));

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <FormControl variant="standard">
        <InputLabel>Power</InputLabel>
        <Input
          name="power"
          onChange={handleChange}
          type="number"
          value={request.power}
        />
      </FormControl>

      <FormControl variant="standard">
        <InputLabel>Velocity</InputLabel>
        <Input
          name="velocity"
          onChange={handleChange}
          type="number"
          value={request.velocity}
        />
      </FormControl>
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel>Material</InputLabel>
        <Select
          label="material"
          name="material"
          onChange={handleSelect}
          value={request.material}
        >
          {materialsJSX}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ClassificationRecordsForm
