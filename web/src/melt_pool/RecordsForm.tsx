/**
 * RecordsForm.tsx
 * Form component for retrieving melt pool records.
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
import { Status } from 'enums';

// Hooks
import { useProcessParameters } from 'melt_pool/_hooks';

const ClassificationRecordsForm: FC = () => {
  // Hooks
  const [request, setRequest] = useState(REQUEST);
  const [{data, status}] = useProcessParameters();

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
  const materialsJSX = status === Status.Succeeded && data.material.map((material) => (
    <MenuItem key={material} value={material}>{material}</MenuItem>
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
