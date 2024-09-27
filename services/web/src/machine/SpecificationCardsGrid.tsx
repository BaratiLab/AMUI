/**
 * SpecificationCardsGrid.tsx
 * Loads machine specification cards within a grid layout.
 * Legacy
 */

// Node Modules
import { Button, Grid } from "@mui/material";
import { FC, useState } from "react";

// Actions
import {
  setProcessMapConfigurationMachine,
  setProcessMapConfigurationSection,
} from "process_map/configurationSlice";

// Components
import MachineSpecificationCard from "machine/SpecificationCard";

// Constants
const INITIAL_SHOW_LIMIT = 6;

// Enums
import { Status } from "enums";
import { Section } from "process_map/_enums";

// Hooks
import { useAppDispatch } from "hooks";
// import { useSpecifications } from "machine/_hooks";

// Types
import { MachineSpecification } from "./_types";

const SpecificationCardsGrid: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const [limit, setLimit] = useState(INITIAL_SHOW_LIMIT);
  // const [
  //   { data: machineSpecificationsData, status: machineSpecificationsStatus },
  // ] = useSpecifications();

  // Callbacks
  const handleShowMoreButtonClick = () => {
    const length = machineSpecificationsData.length;
    setLimit((prevState) =>
      prevState === length ? INITIAL_SHOW_LIMIT : length,
    );
  };

  const handleMachineSpecificationClick = (id: MachineSpecification["id"]) => {
    const machine = machineSpecificationsData.filter(
      (machineSpecification) => machineSpecification.id === id,
    )[0];

    dispatch(
      setProcessMapConfigurationMachine({
        machine_id: id,
        power_max: machine.power_max_w,
        power_min: machine.power_min_w,
        velocity_max: machine.velocity_max_m_per_s,
        velocity_min: machine.velocity_min_m_per_s,
        spot_size_max: machine.spot_size_max_microns,
        spot_size_min: machine.spot_size_min_microns,
        layer_thickness_max: machine.layer_thickness_max_microns,
        layer_thickness_min: machine.layer_thickness_min_microns,
      }),
    );
    dispatch(setProcessMapConfigurationSection(Section.Material));
  };

  // JSX
  const machineSpecificationsJSX =
    machineSpecificationsStatus === Status.Succeeded &&
    machineSpecificationsData
      .filter((_, index) => index < limit)
      .map((specification) => (
        <Grid key={specification.id} item xs={2} sm={4} md={4}>
          <MachineSpecificationCard
            onClick={handleMachineSpecificationClick}
            specification={specification}
          />
        </Grid>
      ));

  const showMoreButtonJSX = limit === INITIAL_SHOW_LIMIT && (
    <Grid item xs={2} sm={4} md={4}>
      <Button onClick={handleShowMoreButtonClick}>Show More</Button>
    </Grid>
  );

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {machineSpecificationsJSX}
      {showMoreButtonJSX}
    </Grid>
  );
};

export default SpecificationCardsGrid;
