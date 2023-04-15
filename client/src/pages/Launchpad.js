import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center'
}));

const GridBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0),
  },
}));

export default function Launchpad() {
  return (
    <GridBox my={4} sx={{ flexGrow: 1 }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={10}>
          <Typography variant="h4">Hello!</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>Graph</Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>Exercise Log</Item>
        </Grid>
        <Grid item xs={12} md={5}>
          <Item>Groups</Item>
        </Grid>
        <Grid item xs={12} md={5}>
          <Item>Penalties</Item>
        </Grid>
      </Grid>
    </GridBox>
  );
}