/**
 * SpecificationCard.tsx
 * Card component for displaying machine specification.
 */

// Node Modules
import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';
import { Avatar, Typography } from '@mui/material';
import styled from '@mui/styled-engine';
import { func } from 'prop-types';
import { FC } from 'react';

// Prop Types
import { machineSpecificationPropType } from './_propTypes';

// Styled Components
const StyledCard = styled(Card)`
  width: 300;

  :hover {
    box-shadow: lightgray 0.25em 0.25em 1em 0.1em;
    cursor: pointer;
    transform: translate(0.15em, -0.15em);
  }
`;

// Types
import { MachineSpecification } from './_types';

interface Props {
  onClick?: (id: MachineSpecification['id']) => void,
  specification: MachineSpecification,
}

// Utils
/**
 * @description Converts 
 * @param min number | null
 * @param max number | null
 * @return string
 */
const minMaxToString = (min?: number | null, max?: number | null) => {
  let minMaxString = "";

  if (min === null && max === null) {
    minMaxString = 'No Data';
  } else if (min === max) {
    minMaxString = `${min}`;
  } else if (min === null) {
    minMaxString = `Maximum ${max}`;
  } else if (max === null) {
    minMaxString = `Mininum ${min}`;
  } else {
    minMaxString = `Ranges from ${min} - ${max}`;
  }

  return minMaxString;
};

const SpecificationCard: FC<Props> = ({
  onClick = () => {},
  specification,
}) => (
  <StyledCard onClick={() => onClick(specification.id)} variant="outlined">
    <CardHeader
      avatar={<Avatar src={specification.company_logo_link} />}
      title={specification.machine}
      subheader="Laser Powderbed Fusion"
    />
    <CardMedia
      component="img"
      height="194"
      image={specification.image_link}
      alt="Machine image"
    />
    <CardContent>
      <Typography>
        Power: {minMaxToString(specification.power_min_w, specification.power_max_w)} Watts
      </Typography>
      <Typography>
        Velocity: {minMaxToString(specification.velocity_min_m_per_s, specification.velocity_max_m_per_s)} m/s
      </Typography>
      <Typography>
        Spot Size: {minMaxToString(specification.spot_size_min_microns, specification.spot_size_max_microns)} μm
      </Typography>
    </CardContent>
  </StyledCard>
);

export default SpecificationCard;

SpecificationCard.propTypes = {
  onClick: func,
  specification: machineSpecificationPropType.isRequired,
};

