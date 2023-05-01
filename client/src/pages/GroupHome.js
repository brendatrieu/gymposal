import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Paper, CircularProgress, IconButton, Button } from '@mui/material';
import { GridBox } from '../components/GridBox';
import SettingsIcon from '@mui/icons-material/Settings';
import EnhancedTable from '../components/BaseTable';
import BaseGraph from '../components/BaseGraph';
// import { useUser } from '../context/AppContext';
import { fetchGroupChartLogs, fetchGroupLogs, fetchGroupSettings } from '../lib/api';
import { groupLogHeaders, groupSettingsHeaders } from '../lib/tables-config';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);
dayjs.extend(dayjsPluginUTC);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center'
}));

async function loadGroupChartLogs(userId, setGroupChartLogRows) {
  const response = await fetchGroupChartLogs(userId);
  response.forEach((row) => row.date = dayjs(row.date).format('MM/DD/YY'));
  setGroupChartLogRows(response);
}

async function loadGroupLogs(groupId, setGroupLogRows) {
  const response = await fetchGroupLogs(groupId);
  response.forEach((row) => {
    row.date = dayjs.utc(row.date).local().format('MM/DD/YY')
  });
  setGroupLogRows(response);
}

async function loadGroupSettings(groupId, setGroupSettingsRows) {
  const response = await fetchGroupSettings(groupId);
  setGroupSettingsRows(response);
}

export default function GroupHome() {
  const { groupId } = useParams();
  // const { userId } = useUser();
  const [groupChartLogRows, setGroupChartLogRows] = useState();
  const [groupLogRows, setGroupLogRows] = useState();
  const [groupSettingsRows, setGroupSettingsRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    Promise.all([loadGroupLogs(groupId, setGroupLogRows),
                loadGroupSettings(groupId, setGroupSettingsRows),
                loadGroupChartLogs(groupId, setGroupChartLogRows)])
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, [groupId]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  return (
    <div>
      <GridBox my={4} sx={{ flexGrow: 1, height: 1 }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid
            container
            item
            xs={12}
            md={10}
            justifyContent="space-between"
          >
            <Typography variant="h4">{groupSettingsRows[0].groupName}</Typography>
            <Link to={`/group-form/${groupId}`} state={groupSettingsRows}>
              <IconButton><SettingsIcon /></IconButton>
            </Link>
          </Grid>
          <Grid item xs={12} md={5} sx={{ position: 'relative', height: '45vh' }}>
            <BaseGraph exercises={groupChartLogRows} legend={true}/>
          </Grid>
          <Grid item xs={12} md={5} sx={{ height: '45vh' }} >
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
          <Grid item xs={12} md={5} sx={{ height: '45vh' }}>
            <EnhancedTable
              rows={groupSettingsRows}
              tableName={'Overview'}
              tableCaption={`Each member must meet the following requirements by each Sunday:`}
              headers={groupSettingsHeaders}
              rowKey={'groupId'}
            />
          </Grid>
          <Grid item xs={12} md={5} sx={{ height: '45vh' }}>
            <Item>Penalties</Item>
          </Grid>
        </Grid>
      </GridBox>
    </div>
  );
}
