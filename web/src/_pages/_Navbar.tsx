/**
 * _Navbar.tsx
 * Navigation bar component for <App />.
 */

// Node Modules
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Navbar: FC = () => (
    <AppBar position="static" color="secondary">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                AMUI
            </Typography>
            <Link to="/view_stl" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button color="inherit">View STL</Button>
            </Link>
            <Link to="/process_map" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button color="inherit">Process Map</Button>
            </Link>
            <Link to="/worksheet" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button color="inherit">Process Worksheet</Button>
            </Link>
        </Toolbar>
    </AppBar>
)

export default Navbar;
