/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import { useAppSelector, useCsrf, useToken } from "hooks";

// Common
import Drawer from "common/_Drawer";
import Navbar from "common/_Navbar";

// Pages
import Machines from "_pages/Machines";
import Materials from "_pages/Materials";
import Overview from "_pages/Overview";
import Parts from "_pages/Parts";
import BuildProfile from "_pages/BuildProfile";
import BuildProfileNew from "_pages/BuildProfileNew";
import BuildProfiles from "_pages/BuildProfiles";
import ProcessMap from "_pages/ProcessMap";
import ProcessMapAccordion from "_pages/ProcessMapAccordion";
import Slicer from "_pages/Slicer";
import Surrogate from "_pages/Surrogate"
import ViewSTL from "_pages/ViewSTL";

const App: FC = () => {
  // Hooks
  const [token] = useToken(); // Retrieves Auth0 token and sets to redux store
  useCsrf();  // Retrieves CSRF token for post requests to Django

  // Firefox has a weird bug where you lose authentication on hard refresh.
  // Does not appear on edge browser, seen on self signed certificate https.
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Navbar />
        {isAuthenticated && token && <Drawer />}
        <Box component="main" sx={{flexGrow: 1, p: 3, marginTop: "64px"}}>
          <Routes>
            {isAuthenticated && token ? (
              <>
                <Route path="" element={<Overview />} />
                <Route path="/machine" element={<Machines />} />
                <Route path="/material" element={<Materials />} />
                <Route path="/part" element={<Parts />} />
                <Route path="/build_profile" element={<BuildProfiles />} />
                <Route path="/build_profile/:id" element={<BuildProfile />} />
                <Route path="/build_profile/new" element={<BuildProfileNew />} />

                {/* Legacy */}
                <Route path="/process_map" element={<ProcessMap />} />
                <Route path="/process_map_accordion" element={<ProcessMapAccordion />} />
                <Route path="/view_stl" element={<ViewSTL />} />
                <Route path="/surrogate" element={<Surrogate />} />
                <Route path="/slicer" element={<Slicer />} />
              </>
            ): (
              <>
                <Route path="" element={<p>Please login</p>} />
                <Route path="/help" element={<p>help</p>} />
              </>
            )}
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
