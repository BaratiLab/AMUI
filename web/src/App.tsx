/**
 * App.tsx
 * Main app component for providing routes for page navigation.
 */

// Node Modules
import Container from '@mui/material/Container';
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Navbar from 'pages/_Navbar';
import ProcessMap from 'pages/ProcessMap';
import MeltPool from 'pages/MeltPool';
import ViewSTL from 'pages/ViewSTL';


const App: FC = () => {
    return (
        <Container>
            <Navbar />
            <Routes>
                <Route path="/view_stl" element={<ViewSTL />} />
                <Route path="/process_map" element={<ProcessMap />} />
                <Route path="/melt_pool" element={<MeltPool />} />
            </Routes>
        </Container>
    );
};

export default App;
