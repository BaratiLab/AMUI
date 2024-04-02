/**
 * RecordsForm.tsx
 * Form component for retrieving melt pool records.
 */

// Node Modules
import { ChangeEvent, FC, FormEvent, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

// Types
import { MeltPoolFilterset } from "./_types";

// Enums
import { Status } from "enums";

// Hooks
import { useProcessParameters } from "melt_pool/_hooks";
import { useRecords } from "melt_pool/_hooks";

// Constants
const REQUEST: MeltPoolFilterset = {
  material: "",
  process: "",
  power: undefined,
  velocity: undefined,
  hatch_spacing: undefined,
};

const ClassificationRecordsForm: FC = () => {
  // Hooks
  const [request, setRequest] = useState(REQUEST);
  const [{ data: processParametersData, status: processParametersStatus }] =
    useProcessParameters();
  const [{ status: recordsStatus }, getRecords] = useRecords();

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // TODO: Findout how to fix `SelectChangeEvent<HTMLSelectElement>` type to
  // remove redundant code.
  const handleSelect = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getRecords(request);
  };

  // JSX
  const materialsJSX =
    processParametersStatus === Status.Succeeded &&
    processParametersData.material.map((material) => (
      <MenuItem key={material} value={material}>
        {material}
      </MenuItem>
    ));

  const processJSX =
    processParametersStatus === Status.Succeeded &&
    processParametersData.process.map((process) => (
      <MenuItem key={process} value={process}>
        {process}
      </MenuItem>
    ));

  // TODO #79: Add form validation.
  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel>Material</InputLabel>
          <Select
            label="material"
            name="material"
            onChange={handleSelect}
            value={request.material}
            // required
          >
            <MenuItem disabled value="">
              <em>Material</em>
            </MenuItem>
            {materialsJSX}
          </Select>
        </FormControl>

        <FormControl variant="standard">
          <InputLabel>Power</InputLabel>
          <Input
            name="power"
            onChange={handleChange}
            type="number"
            value={request.power}
            // required
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel>Velocity</InputLabel>
          <Input
            name="velocity"
            onChange={handleChange}
            type="number"
            value={request.velocity}
            // required
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel>Hatch Spacing</InputLabel>
          <Input
            name="hatch_spacing"
            onChange={handleChange}
            type="number"
            value={request.hatch_spacing}
          />
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel>Process</InputLabel>
          <Select
            label="process"
            name="process"
            onChange={handleSelect}
            value={request.process}
          >
            <MenuItem disabled value="">
              <em>Process</em>
            </MenuItem>
            {processJSX}
          </Select>
        </FormControl>

        <LoadingButton
          loading={recordsStatus === Status.Loading}
          type="submit"
          variant="outlined"
        >
          Submit
        </LoadingButton>
      </Box>
    </form>
  );
};

export default ClassificationRecordsForm;
