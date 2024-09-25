/**
 * _Navbar.tsx
 * Navigation bar component for <App />.
 */

// Node Modules
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { FC, useCallback } from "react";

// Actions
import { toggleThemePalleteMode } from "common/themeSlice";

// Hooks
import { useAppDispatch } from "hooks";

const Navbar: FC = () => {
  // Hooks
  const {isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Callbacks
  const handleClick = useCallback(() => {
    dispatch(toggleThemePalleteMode());
  }, [dispatch]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  // JSX
  const authenticationButtonJSX = isAuthenticated ? (
    <Button color="secondary" onClick={handleLogout} variant="contained">
      Logout
    </Button>
  ) : (
    <Button color="secondary" onClick={handleLogin} variant="contained">
      Login
    </Button>
  );

  return (
    <AppBar 
      position="fixed"
      color="secondary"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          AMUI
        </Typography>
        <div>
          {authenticationButtonJSX}
          <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleClick}>
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
