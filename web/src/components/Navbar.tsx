import { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';


const Navbar: FC = () => {
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    AMUI
                </Typography>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit">Home</Button>
                </Link>
                <Link to="/temp1" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit">Temp1</Button>
                </Link>
                <Link to="/temp2" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit">Temp2</Button>
                </Link>
                <Link to="/temp3" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit">Temp3</Button>
                </Link>
                <Link to="/melt_pool" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit">Melt Pool</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
