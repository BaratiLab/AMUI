/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import { useAppSelector } from "hooks";

// Pages
import Navbar from "_pages/_Navbar";
import ProcessMap from "_pages/ProcessMap";
import ProcessMapAccordion from "_pages/ProcessMapAccordion";
import ViewSTL from "_pages/ViewSTL";
import Worksheet from "_pages/Worksheet";

import ProcessMapChart from "process_map/ProcessMap";

const data = [
  { velocity: 0, keyhole: [0, 600], desirable: [0, 0], lackOfFusion: [0, 0] },
  {
    velocity: 850,
    keyhole: [300, 600],
    desirable: [150, 300],
    lackOfFusion: [0, 150],
  },
  {
    velocity: 1700,
    keyhole: [300, 600],
    desirable: [150, 300],
    lackOfFusion: [0, 150],
  },
  {
    velocity: 2550,
    keyhole: [300, 600],
    desirable: [200, 300],
    lackOfFusion: [0, 200],
  },
  {
    velocity: 3400,
    keyhole: [600, 600],
    desirable: [200, 600],
    lackOfFusion: [0, 200],
  },
  // { velocity: 0, power: 1000},
  { velocity: 3400, power: 1000 },
];

const App: FC = () => {
  // Hooks
  const { mode } = useAppSelector((state) => state.theme);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Navbar />
        <Routes>
          <Route path="" element={<ProcessMapAccordion />} />
          <Route path="/chart" element={<ProcessMapChart />} />
          <Route path="/view_stl" element={<ViewSTL />} />
          <Route path="/process_map" element={<ProcessMap />} />
          <Route path="/worksheet" element={<Worksheet />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
