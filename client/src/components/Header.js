import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';

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
  const {user} = useContext(AppContext);

  return (
    <div>
      <NavBar sx={{ flexGrow: 1}} position="sticky" color="transparent">
        <Toolbar sx={{ justifyContent: "space-between"}}>
          <IconButton>
            <Typography variant="h5" sx={{ fontFamily: "'Permanent Marker', cursive" }}>
              GYMPOSAL
            </Typography>
          </IconButton>
          {user &&
            (<Box sx={{ display: 'flex' }}>
              <Button >Log Exercise</Button>
              <Button >Create Group</Button>
              <IconButton sx={{ pr: 0 }} ><LogoutIcon /></IconButton>
            </Box>)}
        </Toolbar>
      </NavBar>
      <Outlet />
    </div>
  );
}
