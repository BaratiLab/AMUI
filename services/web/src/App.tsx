/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import { useAppSelector } from "hooks";

// Pages
import Navbar from "_pages/_Navbar";
import ProcessMap from "_pages/ProcessMap";
import ProcessMapAccordion from "_pages/ProcessMapAccordion";
import Slicer from "_pages/Slicer";
import Surrogate from "_pages/Surrogate"
import ViewSTL from "_pages/ViewSTL";
import Worksheet from "_pages/Worksheet";

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

  const getCsrfToken = async () => {
    const response = await fetch('/api/csrf-token/', {
        credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };

  useEffect(() => {
      getCsrfToken().then(token => {
          localStorage.setItem('csrfToken', token);
      });
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Navbar />
        <Routes>
          <Route path="" element={<ProcessMapAccordion />} />
          <Route path="/process_map" element={<ProcessMap />} />
          <Route path="/view_stl" element={<ViewSTL />} />
          <Route path="/worksheet" element={<Worksheet />} />
          <Route path="/surrogate" element={<Surrogate />} />
          <Route path="/slicer" element={<Slicer />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
