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
import { FC, useState } from 'react';

// Components
import MachineSpecificationCard from 'machine/SpecificationCard';

// Hooks
import { useSpecifications } from 'machine/_hooks';

// Enums
import { Status } from 'enums';
enum Section {
  Machine = 'machine',
  MeltPool = 'meltPool',
}

const ProcessMapAccordion: FC = () => {
  // Hooks
  const [activeSection, setActiveSection] = useState(Section.Machine);
  const [{
    data: machineSpecificationsdata,
    status: machineSpecificationsStatus
  }] = useSpecifications();

  // Callbacks
  const handleChange = (section: Section) => () => {
    setActiveSection(section);
  };

  // JSX
  const machineSpecificationsJSX =
    machineSpecificationsStatus === Status.Succeeded &&
    machineSpecificationsdata.map(
      (specification) => (
        <MachineSpecificationCard specification={specification}/>
      )
    );

  return (
    <>
      {/* Machine Selection */}
      <Accordion
        expanded={activeSection === Section.Machine}
        onChange={handleChange(Section.Machine)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Machine Specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {machineSpecificationsJSX}
        </AccordionDetails>
      </Accordion>

      {/* Parameter Selection */}
      <Accordion
        expanded={activeSection === Section.MeltPool}
        onChange={handleChange(Section.MeltPool)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Machine Specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          asdf
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProcessMapAccordion;
