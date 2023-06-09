import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useAlert } from '../context/AppContext';
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
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import GridViewIcon from '@mui/icons-material/GridView';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, link: '/' },
  { label: 'Dashboard', icon: <GridViewIcon />, link: '/dashboard' },
  { label: 'Log Exercise', icon: <FitnessCenterIcon />, link: '/log-exercise' },
  { label: 'Create Group', icon: <GroupsIcon />, link: '/group-form' }
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const { user, setUser, tokenKey } = useUser();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    if(user) setAlert({severity: 'success', message: 'Successfully logged out.'});
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
                  ['Dashboard', 'Log Exercise', 'Create Group'].includes(item.label) ?
                  null :
                  <Link key={item.label} to={item.link} style={{textDecoration: 'none', color: 'white'}}>
                    <ListItem disablePadding>
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
            <Divider />
            <List>
              <ListItem disablePadding onClick={handleSignOut}>
                <ListItemButton>
                  <ListItemIcon>
                    {user ? <LogoutIcon /> : <LoginIcon /> }
                  </ListItemIcon>
                  <ListItemText primary={user ? 'Log Out' : 'Sign In'} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Fragment>
    </div>
  );
}
