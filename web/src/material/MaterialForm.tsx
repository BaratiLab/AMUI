/**
 * MaterialForm.tsx
 * Form component for selecting material.
 */

// Node Modules
import { FC, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

// Actions
import { setProcessMapConfigurationSection } from "process_map/configurationSlice";

// Enums
import { Status } from "enums";
import { Section } from "process_map/_enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";
import { useProcessParameters, useProcessParametersByMaterial } from "melt_pool/_hooks";

const RecordsForm: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const [material, setMaterial] = useState<"" | HTMLSelectElement>("");
  const [{ data: processParametersData, status: processParametersStatus }] =
    useProcessParameters();
  const [
    {
      status: processParametersByMaterialStatus,
    },
    getProcessParametersByMaterial,
  ] = useProcessParametersByMaterial();

  useEffect(() => {
    // Changes section to process parameter selection once material is selected.
    if (processParametersByMaterialStatus === Status.Succeeded) {
      dispatch(setProcessMapConfigurationSection(Section.ParameterSelection));
    }
  }, [dispatch, processParametersByMaterialStatus]);

  // Callbacks
  const handleSelect = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setMaterial(value as HTMLSelectElement);

    if (typeof value == "string" && value !== "") {
      // Retrieves process parameters by the selected material.
      getProcessParametersByMaterial(value);
    }
  };

  // JSX
  const materialsJSX =
    processParametersStatus === Status.Succeeded &&
    processParametersData.material.map((material) => (
      <MenuItem key={material} value={material}>
        {material}
      </MenuItem>
    ));

  return (
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
          onChange={handleSelect}
          value={material}
          // required
        >
          <MenuItem disabled value="">
            <em>Material</em>
          </MenuItem>
          {materialsJSX}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RecordsForm;
