import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../context/AppContext';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import AlertBanner from './AlertBanner';

const NavBar = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    button: {
      fontSize: 'small',
    },
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    button: {
      fontSize: 'medium',
    },
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
}));


export default function Header() {
  const { user, setUser, tokenKey } = useUser();
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    navigate('/sign-in');
  }

  return (
    <div>
      <NavBar sx={{ flexGrow: 1, backgroundImage: 'unset', bgcolor: 'secondary.main' }} position="sticky">
        <Toolbar sx={{ justifyContent: "space-between"}}>
          <IconButton sx={{ pl: 0 }}>
            <Link to="/" style={{textDecoration: 'none', color: 'unset' }}>
              <Typography variant="h5" sx={{ fontFamily: "'Permanent Marker', cursive"}}>
                GYMPOSAL
              </Typography>
            </Link>
          </IconButton>
          {user &&
            (<Box sx={{ display: 'flex' }}>
              <Link to="/log-exercise">
                <Button>Log Exercise</Button>
              </Link>
              <Link to="/group-form">
                <Button>Create Group</Button>
              </Link>
              <IconButton sx={{ pr: 0 }} onClick={handleSignOut} ><LogoutIcon /></IconButton>
            </Box>)}
        </Toolbar>
      </NavBar>
      <AlertBanner />
      <Outlet />
    </div>
  );
}
