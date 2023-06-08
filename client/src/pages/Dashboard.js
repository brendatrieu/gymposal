import './Dashboard.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Paper, CircularProgress, Box } from '@mui/material';
import EnhancedTable from '../components/BaseTable';
import EnhancedGroupsTable from '../components/GroupsTable';
import BaseGraph from '../components/BaseGraph';
import GroupTimeline from '../components/GroupTimeline';
import { GridBox } from '../components/GridBox';
import { FlexPaper } from '../components/FlexPaper';
import { useUser } from '../context/AppContext';
import { fetchUserChartLogs, fetchUserLogs, fetchGroups, fetchUserPenalties } from '../lib/api';
import { personalLogHeaders, groupsHeaders, userPenaltiesHeaders } from '../lib/tables-config';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc'

dayjs.extend(dayjsPluginUTC);

async function loadUserChartLogs(userId, setUserChartLogRows) {
  const response = await fetchUserChartLogs(userId);
  setUserChartLogRows(response);
}

async function loadPersonalLogs(userId, setUserLogRows) {
  const response = await fetchUserLogs(userId);
  response.forEach((row) => row.date = dayjs(row.date).local().format('MM/DD/YY'));
  setUserLogRows(response);
}

async function loadGroups(userId, setGroupsRows) {
  const response = await fetchGroups(userId);
  setGroupsRows(response);
}

async function loadPersonalPenalties(userId, setUserPenaltiesRows) {
  const response = await fetchUserPenalties(userId);
  response.forEach((row) => {
    row.date = dayjs(row.date).local().format('MM/DD/YY')
    row.betAmount = `$${row.betAmount}`;
  });
  setUserPenaltiesRows(response);
}

export default function Launchpad() {
  const { user } = useUser();
  const [ userChartLogRows, setUserChartLogRows ] = useState([]);
  const [ userLogRows, setUserLogRows ] = useState([]);
  const [ groupsRows, setGroupsRows ] = useState([]);
  const [ userPenaltiesRows, setUserPenaltiesRows ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) return navigate('/sign-in');
    Promise.all([loadPersonalLogs(user.userId, setUserLogRows),
                  loadGroups(user.userId, setGroupsRows),
                  loadPersonalPenalties(user.userId, setUserPenaltiesRows),
                  loadUserChartLogs(user.userId, setUserChartLogRows)])
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, [user, navigate]);

  const FlexExercise = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      width: (userLogRows.length === 0 && groupsRows.length === 0) ? '100%' : (userLogRows.length === 0 ? '45%' : '100%'),
      alignSelf: 'center'
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      alignSelf: 'center',
      margin: 'auto'
    },
  }));
  const FlexGroup = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      width: (userLogRows.length === 0 && groupsRows.length === 0) ? '100%' : (groupsRows.length === 0 ? '45%' : '100%'),
      alignSelf: 'center'
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      alignSelf: 'center',
      margin: 'auto'
    },
  }));

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  return (
    <div>
      <GridBox my={4} sx={{ flexGrow: 1, height: 1 }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} md={10}>
            <Typography variant="h4" data-testid="greeting">Hello, {user.firstName}!</Typography>
          </Grid>
          <Grid item xs={12} md={(userLogRows.length === 0 && groupsRows.length !== 0) ? 10 : 5} sx={{position: 'relative', minHeight: '40vh' }}>
            {userChartLogRows.length !== 0 ?
              <BaseGraph exercises={userChartLogRows} legend={false} /> :
              (<FlexPaper
                  align="center"
                  sx={{
                    bgcolor: 'primary.main',
                    padding: 4,
                  }}
                >
                  <FlexExercise sx={{ height: '100%' }}>
                    <div className="svg-image-div">
                      <img src="/chart.svg" alt="Line Chart Icon" className="svg-image" />
                    </div>
                    <Typography variant="h6" sx={{ color: 'secondary.main', marginY: 2 }}>
                      <Link to="/log-exercise" className="link">Log your exercises</Link> for the week to begin seeing data.
                    </Typography>
                  </FlexExercise>
                  {groupsRows.length !== 0  && userLogRows.length === 0 ?
                    <FlexExercise>
                      <GroupTimeline page="launchpad" />
                    </FlexExercise> :
                    null
                  }
                </FlexPaper>
              )
            }
          </Grid>
          {userLogRows.length !== 0 ?
            <Grid item xs={12} md={5} sx={{ minHeight: '40vh' }}>
              <EnhancedTable
                rows={userLogRows}
                tableName={'Exercise Log'}
                headers={personalLogHeaders}
                rowKey={'exerciseId'}
              />
            </Grid> :
            null
          }
          <Grid item xs={12} md={(userLogRows.length !== 0 && groupsRows.length === 0) ? 10 : 5} sx={{ minHeight: '35vh' }}>
            {groupsRows.length !== 0 ?
              <EnhancedGroupsTable
                rows={groupsRows}
                tableName={'Groups'}
                headers={groupsHeaders}
                rowKey={'groupId'}
              /> :
              <FlexPaper
                align="center"
                sx={{
                  bgcolor: 'primary.main',
                  padding: 4,
                  }}
              >
                <FlexGroup sx={{ height: '100%' }}>
                  <div className="svg-image-div">
                    <img src="/groups.svg" alt="Group Icon" className="svg-image" />
                  </div>
                  <Typography variant="h6" sx={{ color: 'secondary.main', marginY: 2 }}>
                    <Link to="/group-form" className="link">Create</Link> or join a group to work out with friends.
                  </Typography>
                </FlexGroup>
                {userLogRows.length !== 0 ?
                  <FlexGroup>
                    <GroupTimeline page="launchpad" />
                  </FlexGroup> :
                  null
                }
              </FlexPaper>
            }
          </Grid>
            {groupsRows.length !== 0 ?
              <Grid item xs={12} md={5} sx={{ minHeight: '35vh' }}>
                {(userPenaltiesRows.length !== 0 ?
                  <EnhancedTable
                    rows={userPenaltiesRows}
                    tableName={'Penalties'}
                    headers={userPenaltiesHeaders}
                    rowKey={'penaltyId'}
                  /> :
                  <Paper align="center" sx={{ bgcolor: 'primary.main', padding: 4, height: '100%'}}>
                    <div className="svg-image-div">
                      <img src="/penalties.svg" alt="Leaderboard Icon" className="svg-image" />
                    </div>
                    <div>
                      <Typography variant="h6" sx={{ color: 'secondary.main', marginY: 2 }}>
                        No penalties...yet!
                      </Typography>
                    </div>
                  </Paper>)}
              </Grid>
              :
              null
            }
        </Grid>
      </GridBox>
    </div>
  );
}
