import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Box, Grid, Paper, CircularProgress, Button } from '@mui/material';
import EnhancedTable from '../components/BaseTable';
import { useUser } from '../context/AppContext';
import { fetchPersonalLogs} from '../lib/api';
import { personalLogHeaders } from '../lib/tablesConfig';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc'
dayjs.extend(dayjsPluginUTC);

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

async function loadPersonalLogs(userId, setPersonalLogRows) {
  const response = await fetchPersonalLogs(userId);
  response.forEach((row) => row.date = dayjs.utc(row.date).local().format('MM/DD/YY h:mm A'));
  setPersonalLogRows(response);
}

export default function Launchpad() {
  const { userId } = useUser();
  const [personalLogRows, setPersonalLogRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    Promise.all([loadPersonalLogs(userId, setPersonalLogRows)])
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, [userId]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  return (
    <div>
      <GridBox my={4} sx={{ flexGrow: 1, height: '100%' }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} md={10}>
            <Typography variant="h4" >Hello!</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>Graph</Item>
          </Grid>
          <Grid item xs={12} md={4}>
            {personalLogRows.length ?
              <EnhancedTable
              rows={personalLogRows}
              headers={personalLogHeaders}
              rowKey={'exerciseId'}
              /> :
              <Paper align="center" sx={{bgcolor: 'primary.main'}}>
                <Link to="/log-exercise">
                  <Button sx={{ color: 'secondary.main'}}>Log Exercise</Button>
              </Link>
              </Paper>
            }
          </Grid>
          <Grid item xs={12} md={5}>
            {personalLogRows.length ?
              <Item>Groups</Item> :
              <Paper align="center" sx={{ bgcolor: 'primary.main' }}>
                <Link to="/create-group">
                  <Button sx={{ color: 'secondary.main' }}>Create Group</Button>
                </Link>
              </Paper>
            }
          </Grid>
          <Grid item xs={12} md={5}>
            <Item>Penalties</Item>
          </Grid>
        </Grid>
      </GridBox>
    </div>
  );
}
