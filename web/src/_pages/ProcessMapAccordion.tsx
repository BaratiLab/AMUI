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
import SpecificationCardsGrid from 'machine/SpecificationCardsGrid'

// Enums
enum Section {
  None = 'none',
  Machine = 'machine',
  ParameterSelection = 'parameterSelection',
  ProcessMap = 'processMap'
}

const ProcessMapAccordion: FC = () => {
  // Hooks
  const [activeSection, setActiveSection] = useState(Section.Machine);

  // Callbacks
  const handleChange = (section: Section) => () => {
    setActiveSection(
      (prevState) => prevState === section ? Section.None : section
    );
  };

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
          <SpecificationCardsGrid />
        </AccordionDetails>
      </Accordion>

      {/* Parameter Selection */}
      <Accordion
        expanded={activeSection === Section.ParameterSelection}
        onChange={handleChange(Section.ParameterSelection)}
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
        expanded={activeSection === Section.ProcessMap}
        onChange={handleChange(Section.ProcessMap)}
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
