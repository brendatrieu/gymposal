import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser, useAlert } from '../context/AppContext';
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  Box } from '@mui/material';
import { GridBox } from '../components/GridBox';
import SettingsIcon from '@mui/icons-material/Settings';
import EnhancedTable from '../components/BaseTable';
import BaseGraph from '../components/BaseGraph';
import GroupTimeline from '../components/GroupTimeline';
import { FlexPaper } from '../components/FlexPaper';
import { styled } from '@mui/material/styles';
import {
  fetchGroupUsers,
  fetchGroupChartLogs,
  fetchGroupLogs,
  fetchGroupSettings,
  fetchGroupPenalties,
  postNewGroupMember } from '../lib/api';
import { groupLogHeaders, groupSettingsHeaders, groupPenaltiesHeaders } from '../lib/tables-config';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);
dayjs.extend(dayjsPluginUTC);

async function loadGroupUsers(groupId, setGroupUsers) {
  const response = await fetchGroupUsers(groupId);
  setGroupUsers(response);
}

async function loadGroupChartLogs(userId, setGroupChartLogRows) {
  const response = await fetchGroupChartLogs(userId);
  response.forEach((row) => row.date = dayjs(row.date).local().format('MM/DD/YY'));
  setGroupChartLogRows(response);
}

async function loadGroupLogs(groupId, setGroupLogRows) {
  const response = await fetchGroupLogs(groupId);
  response.forEach((row) => {
    row.date = dayjs(row.date).local().format('MM/DD/YY')
  });
  setGroupLogRows(response);
}

async function loadGroupSettings(groupId, setGroupSettingsRows) {
  const response = await fetchGroupSettings(groupId);
  setGroupSettingsRows(response);
}

async function loadGroupPenalties(groupId, setGroupPenaltiesRows) {
  const response = await fetchGroupPenalties(groupId);
  response.forEach((row) => {
    row.date = dayjs(row.date).local().format('MM/DD/YY')
  });
  setGroupPenaltiesRows(response);
}

export default function GroupHome() {
  const { groupId, inviteLink } = useParams();
  const { user } = useUser();
  const [groupUsers, setGroupUsers] = useState();
  const [groupChartLogRows, setGroupChartLogRows] = useState();
  const [groupLogRows, setGroupLogRows] = useState();
  const [groupSettingsRows, setGroupSettingsRows] = useState();
  const [groupPenaltiesRows, setGroupPenaltiesRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if(!user) return navigate('/sign-in');
    Promise.all([loadGroupUsers(groupId, setGroupUsers),
        loadGroupLogs(groupId, setGroupLogRows),
        loadGroupSettings(groupId, setGroupSettingsRows),
        loadGroupPenalties(groupId, setGroupPenaltiesRows),
        loadGroupChartLogs(groupId, setGroupChartLogRows)])
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [ user, navigate, groupId ]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Page: {error.message}</div>;

  const userIncluded = groupUsers.map(member => member.userId).includes(user.userId);
  const flexWidth = groupLogRows.length === 0 ? '45%' : '100%';
  const FlexGroup = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      width: flexWidth,
      alignSelf: 'center'
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 'auto'
    },
  }));

  function handleAccept() {
    const passes = groupSettingsRows[0].passQty;
    const member = {
      groupId,
      userId: user.userId,
      passQty: passes,
      remainingPasses: passes,
      activeDate: dayjs().utc()
    };
    postNewGroupMember(member);
    setOpen(false);
    navigate(`/group-home/${groupId}`);
    setAlert({ severity: 'success', message: 'Invitation successfully accepted.'});
  }

  function handleDecline() {
    setOpen(false);
    navigate(`/dashboard`);
  }

  function generateInviteLink() {
    let param = encodeURIComponent(groupSettingsRows[0].groupName);
    param = param.replace("'", '%27');
    return `${groupId}/${param}`;
  }

  return (
    <div>
      {!userIncluded && (`${groupId}/${inviteLink}` === generateInviteLink()) &&
        <Dialog
          open={open}
          aria-labelledby="invite-dialog"
          aria-describedby="invite-dialog"
          PaperProps={{sx: {
            background: 'linear-gradient(180deg, rgba(21, 26, 38, 1) 0%, rgba(21, 26, 38, 1) 100%)',
            opacity: 'none',
            padding: 4,
            }
          }}
        >
          <Typography id="invite-dialog" variant="h6" sx={{pb: 2, textAlign: 'center'}}>
            You have been invited to join <strong>{groupSettingsRows[0].groupName}</strong>
          </Typography>
          <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="contained" onClick={handleDecline}>
              Decline
            </Button>
          </DialogActions>
        </Dialog>
      }
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
            {userIncluded &&
              <Link to={`/group-form/${groupId}`} state={groupSettingsRows}>
                <IconButton><SettingsIcon /></IconButton>
              </Link>
            }
          </Grid>
          <Grid item xs={12} md={(groupChartLogRows.length === 0 && groupLogRows.length === 0) ? 10 : 5} sx={{ position: 'relative', minHeight: '45vh' }}>
            {groupChartLogRows.length === 0 ?
              <FlexPaper
                align="center"
                sx={{
                  bgcolor: 'primary.main',
                  padding: 4,
                }}
              >
                <FlexGroup sx={{ height: '100%' }}>
                  <div className="svg-image-div">
                    <img src="/chart.svg" alt="Line Chart Icon" className="svg-image" />
                  </div>
                  <Typography variant="h6" sx={{ color: 'secondary.main', marginY: 2 }}>
                    <Link to="/log-exercise" className="link">Log your exercises</Link> for the week to begin seeing data.
                  </Typography>
                </FlexGroup>
                {groupLogRows.length === 0 ?
                  <FlexGroup>
                    <GroupTimeline page="group-home" />
                  </FlexGroup> :
                  null
                }
              </FlexPaper> :
              <BaseGraph exercises={groupChartLogRows} legend={true}/>
            }
          </Grid>
          {groupLogRows.length === 0 ?
            null :
            <Grid item xs={12} md={5} sx={{ minHeight: '45vh' }} >
              <EnhancedTable
                rows={groupLogRows}
                tableName={'Exercise Log'}
                headers={groupLogHeaders}
                rowKey={'exerciseId'}
              />
            </Grid>
          }
          <Grid item xs={12} md={5} sx={{ minHeight: '40vh' }}>
            <EnhancedTable
              rows={groupSettingsRows}
              tableName={'Overview'}
              tableCaption={`Each member must meet the following requirements by each Sunday:`}
              headers={groupSettingsHeaders}
              rowKey={'groupId'}
              link={userIncluded && generateInviteLink()}
            />
          </Grid>
          <Grid item xs={12} md={5} sx={{ minHeight: '40vh' }}>
            {groupPenaltiesRows.length === 0 ?
              <Paper align="center" sx={{ bgcolor: 'primary.main', padding: 4, height: '100%'}}>
                <div className="svg-image-div">
                  <img src="/penalties.svg" alt="Leaderboard Icon" className="svg-image" />
                </div>
                <div>
                  <Typography variant="h6" sx={{ color: 'secondary.main', marginY: 2 }}>
                    No penalties...yet!
                  </Typography>
                </div>
              </Paper> :
              <EnhancedTable
                rows={groupPenaltiesRows}
                tableName={'Penalties'}
                headers={groupPenaltiesHeaders}
                rowKey={'penaltyId'}
              />
            }
          </Grid>
        </Grid>
      </GridBox>
    </div>
  );
}
