import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Box, Grid, Paper, CircularProgress, IconButton, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EnhancedTable from '../components/BaseTable';
import { useUser } from '../context/AppContext';
import { fetchGroupLogs } from '../lib/api';
import { groupLogHeaders } from '../lib/tables-config';
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

async function loadGroupLogs(groupId, setGroupLogRows) {
  const response = await fetchGroupLogs(groupId);
  response.forEach((row) => row.date = dayjs.utc(row.date).local().format('MM/DD/YY'));
  setGroupLogRows(response);
  console.log(response);
}

export default function GroupHome() {
  const { groupId } = useParams();
  const { userId } = useUser();
  const [groupLogRows, setGroupLogRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    Promise.all([loadGroupLogs(groupId, setGroupLogRows)])
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, [groupId]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  return (
    <div>
      <GridBox my={4} sx={{ flexGrow: 1, height: '100%' }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid container item xs={12} md={10} justifyContent="space-between">
            <Typography variant="h4">{groupLogRows[0].groupName}</Typography>
            <IconButton><SettingsIcon /></IconButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>Graph</Item>
          </Grid>
          <Grid item xs={12} md={4}>
            {groupLogRows.length ?
              <EnhancedTable
                rows={groupLogRows}
                tableName={'Exercise Log'}
                headers={groupLogHeaders}
                rowKey={'exerciseId'}
              /> :
              <Paper align="center" sx={{ bgcolor: 'primary.main' }}>
                <Link to="/log-exercise">
                  <Button sx={{ color: 'secondary.main' }}>Log Exercise</Button>
                </Link>
              </Paper>
            }
          </Grid>
          <Grid item xs={12} md={5}>
            {/* {groupLogRows.length ?
              <Item>Groups</Item> :
              <Paper align="center" sx={{ bgcolor: 'primary.main' }}>
                <Link to="/create-group">
                  <Button sx={{ color: 'secondary.main' }}>Create Group</Button>
                </Link>
              </Paper>
            } */}
          </Grid>
          <Grid item xs={12} md={5}>
            <Item>Penalties</Item>
          </Grid>
        </Grid>
      </GridBox>
    </div>
  );
}
