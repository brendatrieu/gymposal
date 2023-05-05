import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/AppContext';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Modal,
  Box } from '@mui/material';
import { GridBox } from '../components/GridBox';
import SettingsIcon from '@mui/icons-material/Settings';
import EnhancedTable from '../components/BaseTable';
import BaseGraph from '../components/BaseGraph';
import {
  fetchGroupUsers,
  fetchGroupChartLogs,
  fetchGroupLogs,
  fetchGroupSettings } from '../lib/api';
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
    row.date = dayjs.utc(row.date).local().format('MM/DD/YY')
  });
  setGroupLogRows(response);
}

async function loadGroupSettings(groupId, setGroupSettingsRows) {
  const response = await fetchGroupSettings(groupId);
  setGroupSettingsRows(response);
}

export default function GroupHome() {
  const { groupId, inviteLink } = useParams();
  const { user } = useUser();
  const [groupUsers, setGroupUsers] = useState();
  const [groupChartLogRows, setGroupChartLogRows] = useState();
  const [groupLogRows, setGroupLogRows] = useState();
  const [groupSettingsRows, setGroupSettingsRows] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(!!inviteLink);

  useEffect(() => {
    if(!user) return navigate('/sign-in');
    Promise.all([loadGroupUsers(groupId, setGroupUsers),
        loadGroupLogs(groupId, setGroupLogRows),
        loadGroupSettings(groupId, setGroupSettingsRows),
        loadGroupChartLogs(groupId, setGroupChartLogRows)])
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, [ user, navigate, groupId ]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  const userIncluded = groupUsers.map(member => member.userId).includes(user.userId);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    borderRadius: 1
  };
  function handleAccept() {
    setOpen(false);
    navigate(`/group-home/${groupId}`);
  }
  function handleDecline() {
    setOpen(false);
    navigate(`/group-home/${groupId}`);
  }

  return (
    <div>
      {!userIncluded &&
        <Modal
        open={open}
        aria-labelledby="invite-modal"
        aria-describedby="invite-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="invite-modal" variant="h6" sx={{pb: 2}}>
            Accept the invite to join <strong>{groupSettingsRows[0].groupName}</strong>
          </Typography>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="contained" onClick={handleDecline}>
              Decline
            </Button>
          </span>
        </Box>
      </Modal>
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
          <Grid item xs={12} md={5} sx={{ position: 'relative', minHeight: '45vh' }}>
            <BaseGraph exercises={groupChartLogRows} legend={true}/>
          </Grid>
          <Grid item xs={12} md={5} sx={{ minHeight: '45vh' }} >
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
          <Grid item xs={12} md={5} sx={{ minHeight: '40vh' }}>
            <EnhancedTable
              rows={groupSettingsRows}
              tableName={'Overview'}
              tableCaption={`Each member must meet the following requirements by each Sunday:`}
              headers={groupSettingsHeaders}
              rowKey={'groupId'}
              link={groupSettingsRows[0].inviteLink}
            />
          </Grid>
          <Grid item xs={12} md={5} sx={{ minHeight: '40vh' }}>
            <Item>Penalties</Item>
          </Grid>
        </Grid>
      </GridBox>
    </div>
  );
}
