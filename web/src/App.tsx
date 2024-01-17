import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Temp1 from './pages/Temp1';
import Temp2 from './pages/Temp2';
import { ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { theme } from './theme';


const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temp1" element={<Temp1 />} />
                <Route path="/temp2" element={<Temp2 />} />
            </Routes>
        </div>
            </Container>
        </ThemeProvider>
           
    );
};

export default App;
