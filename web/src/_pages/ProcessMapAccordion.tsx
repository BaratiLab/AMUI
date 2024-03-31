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
import RecordsForm from "melt_pool/RecordsForm";
import Chart from "process_map/Chart";
import Table from "melt_pool/Table";

// Constants
const COLUMN_NAMES = [
  "id",
  "power",
  "velocity",
  "material",
  "process",
  "sub_process",
  "hatch_spacing",
];

// Enums
import { Status } from "enums";
import { Section } from "process_map/_enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";
import { useSpecifications } from "machine/_hooks";
import { useRecords } from "melt_pool/_hooks";

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
  const [{ data: recordsData, status: recordsStatus }] = useRecords();

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

  const chartJSX = recordsStatus === Status.Succeeded && (
    <Chart data={recordsData} />
  );

  const tableJSX = recordsStatus === Status.Succeeded && (
    <Table colNames={COLUMN_NAMES} rows={recordsData} />
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
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Machine Specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SpecificationCardsGrid />
        </AccordionDetails>
      </Accordion>

      {/* Parameter Selection */}
      <Accordion
        expanded={
          processMapConfigurationState.section === Section.ParameterSelection
        }
        onChange={handleSetProccessMapSection(Section.ParameterSelection)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Parameter Selection
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RecordsForm />
        </AccordionDetails>
      </Accordion>
      <Box display="flex" justifyContent="center" alignItems="center">
        {chartJSX}
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        {tableJSX}
      </Box>

      {/* Process Map */}
      {/* <Accordion
        expanded={processMapConfigurationState.section === Section.ProcessMap}
        onChange={handleSetProccessMapSection(Section.ProcessMap)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Example Process Map
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          Process Map form
        </AccordionDetails>
      </Accordion> */}
    </>
  );
};

export default ProcessMapAccordion;
