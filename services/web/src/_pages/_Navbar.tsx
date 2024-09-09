/**
 * _Navbar.tsx
 * Navigation bar component for <App />.
 */

// Node Modules
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { FC, useCallback } from "react";

// Actions
import { toggleThemePalleteMode } from "common/themeSlice";

// Hooks
import { useAppDispatch } from "hooks";

const Navbar: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Callbacks
  const handleClick = useCallback(() => {
    dispatch(toggleThemePalleteMode());
  }, [dispatch]);

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
        <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleClick}>
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
