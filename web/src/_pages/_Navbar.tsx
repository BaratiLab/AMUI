/**
 * _Navbar.tsx
 * Navigation bar component for <App />.
 */

// Node Modules
import { AppBar, Button, IconButton, Toolbar, Typography, } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { FC, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Actions
import { toggleThemePalleteMode } from 'common/themeSlice';

// Hooks
import { useAppDispatch } from 'hooks';

const Navbar: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Callbacks
  const handleClick = useCallback(() => {
    dispatch(toggleThemePalleteMode())
  }, [dispatch]);

  return (
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
        <IconButton sx={{ ml: 1}} color="inherit" onClick={handleClick}>
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
