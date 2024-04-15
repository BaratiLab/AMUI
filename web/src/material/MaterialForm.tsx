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
import { fetchMetals } from "material/metalsSlice";
import { fetchEagarTsai } from "melt_pool/eagarTsaiSlice";

// Constants
const OMITTED_MATERIALS = [
'Al-C-Co-Fe-Mn-Ni',
'Cu10Sn',
'IN738LC',
'MS1-',
'Ti-45Al',
'Ti6242',
'Tungsten',
'WE43',
]

// Enums
import { Status } from "enums";
import { Section } from "process_map/_enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";
// import { useProcessParameters } from "melt_pool/_hooks";

const RecordsForm: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const [material, setMaterial] = useState<"" | HTMLSelectElement>("");
  const state = useAppSelector((state) => state.materialMetals);
  // const [{ status: processParametersStatus }, getProcessParameters] =
  //   useProcessParameters();

  // useEffect(() => {
  //   // Changes section to process parameter selection once material is selected.
  //   if (processParametersStatus === Status.Succeeded) {
  //     dispatch(setProcessMapConfigurationSection(Section.ParameterSelection));
  //   }
  // }, [dispatch, processParametersStatus]);

  useEffect(() => {
    // Retreives available metals from materials app.
    if (state.status === Status.Idle) {
      dispatch(fetchMetals());
    }
  }, [dispatch, state.status]);

  // Callbacks
  const handleSelect = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setMaterial(value as HTMLSelectElement);

    if (typeof value == "string" && value !== "") {
      // Retrieves process parameters by the selected material.
      // getProcessParameters(value);
      dispatch(fetchEagarTsai(value));
    }

    dispatch(setProcessMapConfigurationSection(Section.ProcessMap));
  };

  // JSX
  const materialsJSX =
    state.status === Status.Succeeded &&
    state.data
      .filter((material) => !OMITTED_MATERIALS.includes(material))
      .map((material) => (
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
