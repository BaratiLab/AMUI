/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import Container from '@mui/material/Container';
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Navbar from '_pages/_Navbar';
import ProcessMap from '_pages/ProcessMap';
import ViewSTL from '_pages/ViewSTL';
import Worksheet from '_pages/Worksheet'

const App: FC = () => (
  <Container>
    <Navbar />
    <Routes>
      <Route path="/view_stl" element={<ViewSTL />} />
      <Route path="/process_map" element={<ProcessMap />} />
      <Route path="/worksheet" element={<Worksheet />} />
    </Routes>
  </Container>
);

export default App;
