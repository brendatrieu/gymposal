import { useState, Fragment } from 'react';
import {
  Box,
  Drawer,
  Button,
  List,
  Icon,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
   } from '@mui/material';
import {
  InfoIcon,
  FitnessCenterIcon,
  GroupsIcon,
  LogoutIcon
} from '@mui/icons-material';

const NavItems = [
  { label: 'About', icon: 'InfoIcon' },
  { label: 'Log Exercise', icon: 'FitnessCenterIcon' },
  { label: 'Create Group', icon: 'GroupsIcon' }
];

export default function NavMenu() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(!open);
  };

  return (
    <div>
        <Fragment >
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
                {/* {NavItems.map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton>

                      <ListItemIcon>
                        <Icon>{item.icon}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))} */}
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InfoIcon /> : <GroupsIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
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
