import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
   } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';

const navItems = [
  { label: 'About', icon: <InfoIcon data-testid="InfoIcon" />, link: '/about' },
  { label: 'Log Exercise', icon: <FitnessCenterIcon />, link: '/log-exercise' },
  { label: 'Create Group', icon: <GroupsIcon />, link: '/group-form' }
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(!open);
  };

  return (
    <div>
      <Fragment>
      <Button onClick={toggleDrawer}>Menu</Button>
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer}
        >
          <Box
            sx={{ width: 250 }}
            role="menu"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
              {navItems.map((item) => (
                <Link to={item.link}>
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                      { item.icon }
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Log Out'} />
                  </ListItemButton>
                </ListItem>
            </List>
          </Box>
        </Drawer>
      </Fragment>
    </div>
  );
}
