import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {

  return (
    <AppBar sx={{ flexGrow: 1 }} position="sticky" color="transparent">
      <Toolbar sx={{ justifyContent: "space-between"}}>
        <IconButton>
          <Typography variant="h5" sx={{ fontFamily: "'Permanent Marker', cursive" }}>
            GYMPOSAL
          </Typography>
        </IconButton>
        <Box sx={{ display: 'flex' }}>
          <Button size="small">Log Exercise</Button>
          <Button size="small">Create Group</Button>
          <IconButton><LogoutIcon /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
