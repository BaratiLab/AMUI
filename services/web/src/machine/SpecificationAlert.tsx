/**
 * SpecificationAlert.tsx
 * Alert component to display machine specification details in alert box.
 */

// Node Modules
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import { FC } from "react";

// Types
import { MachineSpecification } from "./_types";

interface Props {
  specification: MachineSpecification;
}

const minMaxToRangeString = (min?: number | null, max?: number | null) => {
  let minMaxString = "";

  if (min === null && max === null) {
    minMaxString = "No Data";
  } else if (min === max) {
    minMaxString = `${min}`;
  } else {
    minMaxString = `${min === null ? 0 : min} - ${max === null ? "unknown" : max}`;
  }

  return minMaxString;
};

const SpecificationAlert: FC<Props> = ({
  specification: {
    company,
    image_link,
    machine,
    power_max_w,
    power_min_w,
    velocity_max_m_per_s,
    velocity_min_m_per_s,
    layer_thickness_min_microns,
    layer_thickness_max_microns,
  },
}) => (
  <Alert severity="info" variant="outlined" sx={{ marginY: 2.5 }}>
    <AlertTitle>
      <Typography variant="h5">{machine}</Typography>
    </AlertTitle>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box
        component="img"
        src={image_link}
        sx={{ width: 150, marginRight: 2.5, borderRadius: 2.5 }}
      />
      <Box>
        <Typography variant="body1">Company: {company}</Typography>
        <Typography variant="body1">
          Power: {minMaxToRangeString(power_min_w, power_max_w)} Watts
        </Typography>
        <Typography variant="body1">
          Velocity:{" "}
          {minMaxToRangeString(velocity_min_m_per_s, velocity_max_m_per_s)} m/s
        </Typography>
        <Typography variant="body1">
          Layer Thickness:{" "}
          {minMaxToRangeString(
            layer_thickness_min_microns,
            layer_thickness_max_microns,
          )}{" "}
          µm
        </Typography>
      </Box>
    </Box>
  </Alert>
);

export default SpecificationAlert;
