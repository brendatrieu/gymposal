import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Paper, CircularProgress, Button } from '@mui/material';
import EnhancedTable from '../components/BaseTable';
import EnhancedGroupsTable from '../components/GroupsTable';
import { GridBox } from '../components/GridBox';
import { useUser } from '../context/AppContext';
import { fetchPersonalLogs, fetchGroups } from '../lib/api';
import { personalLogHeaders, groupsHeaders } from '../lib/tables-config';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc'

dayjs.extend(dayjsPluginUTC);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center'
}));

async function loadPersonalLogs(userId, setPersonalLogRows) {
  const response = await fetchPersonalLogs(userId);
  response.forEach((row) => row.date = dayjs.utc(row.date).local().format('MM/DD/YY'));
  setPersonalLogRows(response);
}

async function loadGroups(userId, setGroupsRows) {
  const response = await fetchGroups(userId);
  setGroupsRows(response);
}

export default function Launchpad() {
  const { userId } = useUser();
  const [personalLogRows, setPersonalLogRows] = useState();
  const [groupsRows, setGroupsRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    Promise.all([loadPersonalLogs(userId, setPersonalLogRows),
                  loadGroups(userId, setGroupsRows)])
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
              tableName={'Exercise Log'}
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
            {groupsRows.length ?
              <EnhancedGroupsTable
                rows={groupsRows}
                tableName={'Groups'}
                headers={groupsHeaders}
                rowKey={'groupId'}
              /> :
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
