import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center'
}));

export default function Launchpad() {
  return (
    <Box sx={{ flexGrow: 1, margin: 'auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Item>Exercise Log</Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>Graph</Item>
        </Grid>
        <Grid item xs={12} md={5}>
          <Item>Groups</Item>
        </Grid>
        <Grid item xs={12} md={5}>
          <Item>Penalties</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
