/**
 * ProcessMapAccordion.tsx
 * Page component for guiding user through retrieving process parameter map.
 */

// Node Modules
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FC, useEffect, useState } from "react";

// Actions
import { setProcessMapConfigurationSection } from "process_map/configurationSlice";

// Components
import SpecificationAlert from "machine/SpecificationAlert";
import SpecificationCardsGrid from "machine/SpecificationCardsGrid";
import MaterialForm from "material/MaterialForm";
import NominalProcessParametersTable from "process_map/NominalProcessParametersTable";
import ProcessMap from "process_map/ProcessMapOld";
import ProcessParameters from "process_map/ProcessParameters";

// Enums
import { Status } from "enums";
import { Section } from "process_map/_enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";
import { useSpecifications } from "machine/_hooks";

// Types
import { MachineSpecification } from "machine/_types";

const ProcessMapAccordion: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const processMapConfigurationState = useAppSelector(
    (state) => state.processMapConfiguration,
  );
  const [machine, setMachine] = useState<MachineSpecification | null>(null);
  const [
    { data: machineSpecificationsData, status: machineSpecificationsStatus },
  ] = useSpecifications();

  useEffect(() => {
    // Sets machine to state from redux store.
    if (machineSpecificationsStatus === Status.Succeeded) {
      const machine = machineSpecificationsData.filter(
        (machineSpecification) =>
          machineSpecification.id === processMapConfigurationState.machine_id,
      )[0];
      setMachine(machine);
    }
  }, [
    machineSpecificationsData,
    machineSpecificationsStatus,
    processMapConfigurationState.machine_id,
  ]);

  // Callbacks
  const handleSetProccessMapSection = (section: Section) => () => {
    dispatch(
      setProcessMapConfigurationSection(
        section === processMapConfigurationState.section
          ? Section.None
          : section,
      ),
    );
  };

  // JSX
  const machineConfigurationJSX = machine?.id && (
    <SpecificationAlert specification={machine} />
  );

  return (
    <>
      {machineConfigurationJSX}

      {/* Machine Selection */}
      <Accordion
        expanded={processMapConfigurationState.section === Section.Machine}
        onChange={handleSetProccessMapSection(Section.Machine)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Machine</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SpecificationCardsGrid />
        </AccordionDetails>
      </Accordion>

      {/* Material Selection */}
      <Accordion
        expanded={processMapConfigurationState.section === Section.Material}
        onChange={handleSetProccessMapSection(Section.Material)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Material</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MaterialForm />
        </AccordionDetails>
      </Accordion>

      {/* Process Map */}
      <Accordion
        expanded={processMapConfigurationState.section === Section.ProcessMap}
        onChange={handleSetProccessMapSection(Section.ProcessMap)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Process Map
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box display="flex" sx={{ gap: "50px" }}>
            <ProcessMap />
            <ProcessParameters />
          </Box>
          <NominalProcessParametersTable />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProcessMapAccordion;
