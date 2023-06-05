import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../context/AppContext';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import AlertBanner from './AlertBanner';
import NavMenu from './NavMenu';

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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton sx={{ pl: 0 }}>
            <Link to="/" style={{textDecoration: 'none', color: 'unset' }}>
              <Typography variant="h5" sx={{ fontFamily: "'Permanent Marker', cursive"}}>
                GYMPOSAL
              </Typography>
            </Link>
          </IconButton>
          <NavMenu />
        </Toolbar>
      </NavBar>
      <AlertBanner />
      <Outlet />
    </div>
  );
}
