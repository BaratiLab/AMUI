/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

// Hooks
import { useAppSelector } from 'hooks';

// Pages 
import Navbar from '_pages/_Navbar';
import ProcessMap from '_pages/ProcessMap';
import ProcessMapWizard from '_pages/ProcessMapWizard';
import ViewSTL from '_pages/ViewSTL';

const App: FC = () => {
  // Hooks
  const { mode } = useAppSelector(state => state.theme);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    }
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Navbar />
        <Routes>
          <Route path="" element={<ProcessMapWizard />} />
          <Route path="/view_stl" element={<ViewSTL />} />
          <Route path="/process_map" element={<ProcessMap />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
