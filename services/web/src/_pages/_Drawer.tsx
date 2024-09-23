/**
 * _Drawer.tsx
 * Side drawer component for navigation.
 */

// Node Modules
import { FC, ReactNode } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {
  Home,
  Microwave,
  Science,
  StackedLineChart,
} from '@mui/icons-material';

const drawerWidth = 240;

const topListItems = [
  {
    text: "Overview",
    icon: <Home />,
    link: "/",
  },
  {
    text: "Profiles",
    icon: <StackedLineChart />,
    link: "/profile",
  },
];

// For read only pages, general data about machines, materials, etc.
const bottomListItems = [
  {
    text: "Materials",
    icon: <Science />,
    link: "/material",
  },
  {
    text: "Machines",
    icon: <Microwave />,
    link: "/machine",
  },
];

interface LinkListItemProps {
  linkListItem: {
    text: string;
    icon: ReactNode;
    link: string;
  }
}

const LinkListItem: FC<LinkListItemProps> = ({ linkListItem }) => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: Change main text and icon style to different color when selected
  // instead of just greying out.
  return (
    <ListItem key={linkListItem.link} disablePadding>
      <ListItemButton
        onClick={() => navigate(linkListItem.link)}
        selected={location.pathname === linkListItem.link}
        disabled={location.pathname === linkListItem.link}
      >
        <ListItemIcon>
          <ListItemIcon>{linkListItem.icon}</ListItemIcon>
        </ListItemIcon>
        <ListItemText primary={linkListItem.text} />
      </ListItemButton>
    </ListItem>
  )
};

const _Drawer: FC = () => {

  // JSX
  const topListItemsJSX = topListItems.map((listItem) => (
    <LinkListItem linkListItem={listItem} />
  ));

  const bottomListItemsJSX = bottomListItems.map((listItem) => (
    <LinkListItem linkListItem={listItem} />
  ));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>{topListItemsJSX}</List>
        <Divider />
        <List>{bottomListItemsJSX}</List>
      </Box>
    </Drawer>
  );
};

export default _Drawer;
