/**
 * ProcessMapAccordion.tsx
 * Page component for guiding user through retrieving process parameter map.
 */

// Node Modules
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FC, useEffect, useState } from 'react';

// Actions
import { setProcessMapSection } from 'process_map/configurationSlice';

// Components
import SpecificationCardsGrid from 'machine/SpecificationCardsGrid'

// Enums
import { Status } from 'enums';
import { Section } from 'process_map/_enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';
import { useSpecifications } from 'machine/_hooks';

// Types
import { MachineSpecification } from 'machine/_types';

const ProcessMapAccordion: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const processMapConfigurationState = useAppSelector(
    state => state.processMapConfiguration
  );
  const [machine, setMachine] = useState<MachineSpecification | null>(null);
  const [{
    data: machineSpecificationsData,
    status: machineSpecificationsStatus
  }] = useSpecifications();

  useEffect(() => {
    // Sets machine to state from redux store.
    if (machineSpecificationsStatus === Status.Succeeded) {
      const machine = machineSpecificationsData.filter(
        (machineSpecification) =>
          machineSpecification.id === processMapConfigurationState.machine_id
      )[0];
      setMachine(machine)
    }
  }, [
    machineSpecificationsStatus,
    processMapConfigurationState.machine_id
  ]);

  // Callbacks
  const handleSetProccessMapSection = (section: Section) => () => {
    dispatch(setProcessMapSection(section));
  };

  // JSX
  const machineConfigurationJSX = machine?.id && (
    <Typography>
      {machine.machine}
    </Typography>
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
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Machine Specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SpecificationCardsGrid />
        </AccordionDetails>
      </Accordion>

      {/* Parameter Selection */}
      <Accordion
        expanded={processMapConfigurationState.section === Section.ParameterSelection}
        onChange={handleSetProccessMapSection(Section.ParameterSelection)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Parameter Selection
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          Parameter selction form
        </AccordionDetails>
      </Accordion>

      {/* Process Map */}
      <Accordion
        expanded={processMapConfigurationState.section === Section.ProcessMap}
        onChange={handleSetProccessMapSection(Section.ProcessMap)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Process Map
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          Process Map form
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProcessMapAccordion;
