/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import { useAppSelector } from "hooks";

// Common
import Drawer from "common/_Drawer";
import Navbar from "common/_Navbar";

// Pages
import Machines from "_pages/Machines";
import Materials from "_pages/Materials";
import Overview from "_pages/Overview";
import Parts from "_pages/Parts";
import Profiles from "_pages/Profiles";
import ProcessMap from "_pages/ProcessMap";
import ProcessMapAccordion from "_pages/ProcessMapAccordion";
import Slicer from "_pages/Slicer";
import Surrogate from "_pages/Surrogate"
import ViewSTL from "_pages/ViewSTL";

const App: FC = () => {
  // Hooks
  const { isAuthenticated } = useAuth0();
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

  console.log(`isauth ${isAuthenticated}`)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Navbar />
        <Drawer />
        <Box component="main" sx={{flexGrow: 1, p: 3, marginTop: "64px"}}>
          <Routes>
            <Route path="" element={<Overview />} />
            <Route path="/machine" element={<Machines />} />
            <Route path="/material" element={<Materials />} />
            <Route path="/part" element={<Parts />} />
            <Route path="/profile" element={<Profiles />} />

            {/* Legacy */}
            <Route path="/process_map" element={<ProcessMap />} />
            <Route path="/process_map_accordion" element={<ProcessMapAccordion />} />
            <Route path="/view_stl" element={<ViewSTL />} />
            <Route path="/surrogate" element={<Surrogate />} />
            <Route path="/slicer" element={<Slicer />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
