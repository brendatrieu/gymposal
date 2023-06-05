import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/AppContext';
import {
  Box,
  Drawer,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
   } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, link: '/' },
  { label: 'About', icon: <InfoIcon data-testid="InfoIcon" />, link: '/about' },
  { label: 'Log Exercise', icon: <FitnessCenterIcon />, link: '/log-exercise' },
  { label: 'Create Group', icon: <GroupsIcon />, link: '/group-form' }
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const { user, setUser, tokenKey } = useUser();
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    navigate('/sign-in');
  }

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(!open);
  };

  return (
    <div>
      <Fragment>
      <IconButton onClick={toggleDrawer}><MenuIcon /></IconButton>
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer}
          PaperProps={{ sx: {background: 'linear-gradient(180deg, rgba(21, 26, 38, 1) 0%, rgba(21, 26, 38, 1) 100%)'} }}
        >
          <Box
            sx={{ width: 250 }}
            role="menu"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
              {navItems.map((item) => (
                (!user &&
                  ['Home', 'Log Exercise', 'Create Group'].includes(item.label) ?
                  null :
                  <Link to={item.link} style={{textDecoration: 'none', color: 'white'}}>
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton>
                      <ListItemIcon>
                        { item.icon }
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                    </ListItem>
                  </Link>)
              ))}
            </List>
            {user &&
              <>
                <Divider />
                <List>
                    <ListItem disablePadding onClick={handleSignOut}>
                      <ListItemButton>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Log Out'} />
                      </ListItemButton>
                    </ListItem>
                </List>
              </>
            }
          </Box>
        </Drawer>
      </Fragment>
    </div>
  );
}
