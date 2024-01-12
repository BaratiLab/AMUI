import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Temp1 from './pages/Temp1';
import Temp2 from './pages/Temp2';


const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temp1" element={<Temp1 />} />
                <Route path="/temp2" element={<Temp2 />} />
            </Routes>
        </div>
    );
};

export default App;
