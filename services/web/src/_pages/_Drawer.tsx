/**
 * _Drawer.tsx
 * Side drawer component for navigation.
 */

// Node Modules
import { FC } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const topListItems = [
  {
    text: "Machine",
    link: "/machine",
  },
  {
    text: "Material",
    link: "/material",
  },
  {
    text: "Process Map",
    link: "process_map",
  },
]

const _Drawer: FC = () => {
  // Hooks
  const navigate = useNavigate();

  // JSX
  const topListItemsJSX = topListItems.map((listItem, index) => (
    <ListItem key={listItem.link} disablePadding>
      <ListItemButton onClick={() => navigate(listItem.link)}>
        <ListItemIcon>
          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText primary={listItem.text} />
      </ListItemButton>
    </ListItem>
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
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default _Drawer;
