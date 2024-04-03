/**
 * RecordsForm.tsx
 * Form component for retrieving melt pool records given a machine preset.
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
  Slider,
} from "@mui/material";

// Types
import { MeltPoolFilterset } from "./_types";

// Enums
import { Status } from "enums";

// Hooks
import { useAppSelector } from "hooks";
import {
  useProcessParameters,
  useProcessParametersByMaterial,
  useRecords,
} from "melt_pool/_hooks";

// Constants
const REQUEST: MeltPoolFilterset = {
  material: "",
  process: "",
  power: undefined,
  velocity: undefined,
  hatch_spacing: undefined,
};

const RecordsForm: FC = () => {
  // Hooks
  const [request, setRequest] = useState(REQUEST);
  const [{ data: processParametersData, status: processParametersStatus }] =
    useProcessParameters();
  const [
    {
      data: processParametersByMaterialData,
      status: processParametersByMaterialStatus,
    },
    getProcessParametersByMaterial,
  ] = useProcessParametersByMaterial();
  const [{ status: recordsStatus }, getRecords] = useRecords();
  const processMapConfiguration = useAppSelector(
    (state) => state.processMapConfiguration,
  );

  console.log(processParametersByMaterialData);

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

  const handleSelectMaterial = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (typeof value == "string" && value !== "") {
      // Retrieves process parameters by the selected material.
      getProcessParametersByMaterial(value);
    }
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
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: "column" }}
      >
        <FormControl fullWidth variant="standard">
          <InputLabel>Material</InputLabel>
          <Select
            label="material"
            name="material"
            onChange={handleSelectMaterial}
            value={request.material}
            // required
          >
            <MenuItem disabled value="">
              <em>Material</em>
            </MenuItem>
            {materialsJSX}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <InputLabel>Power</InputLabel>
          <Input
            name="power"
            onChange={handleChange}
            type="number"
            value={request.power}
            disabled={processParametersByMaterialStatus === Status.Idle}
            // required
          />
          <Slider
            name="power"
            // value={value}
            // onChange={handleChange}
            min={processMapConfiguration.power_min}
            max={processMapConfiguration.power_max}
            marks={processParametersByMaterialData.power_marks}
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <InputLabel>Velocity</InputLabel>
          <Input
            name="velocity"
            onChange={handleChange}
            type="number"
            value={request.velocity}
            disabled={processParametersByMaterialStatus === Status.Idle}
            // required
          />
          <Slider
            name="velocity"
            // value={value}
            // onChange={handleChange}
            min={processMapConfiguration.velocity_min}
            max={processMapConfiguration.velocity_max}
            marks={processParametersByMaterialData.velocity_marks}
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <InputLabel>Hatch Spacing</InputLabel>
          <Input
            name="hatch_spacing"
            onChange={handleChange}
            type="number"
            value={request.hatch_spacing}
            disabled={processParametersByMaterialStatus === Status.Idle}
          />
          <Slider
            name="hatch_spacing"
            // value={value}
            // onChange={handleChange}
            min={0}
            max={1000}
            marks={processParametersByMaterialData.hatch_spacing_marks}
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <InputLabel>Process</InputLabel>
          <Select
            label="process"
            name="process"
            onChange={handleSelect}
            value={request.process}
            disabled={processParametersByMaterialStatus === Status.Idle}
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

export default RecordsForm;
