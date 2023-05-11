import {
  Typography,
  Button,
  Modal,
  Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { postNewGroupMember } from '../lib/api';


dayjs.extend(utc);

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: 1,
  [theme.breakpoints.up('md')]: {
    width: 500,
  },
  [theme.breakpoints.down('md')]: {
    width: 300,
  },
}));

function handleAccept(settings, setOpen, navigate, setAlert, user) {
  const passes = settings.passQty;
  const member = {
    groupId: settings.groupId,
    userId: user.userId,
    passQty: passes,
    remainingPasses: passes,
    activeDate: dayjs().utc()
  };
  postNewGroupMember(member);
  setOpen(false);
  navigate(`/group-home/${settings.groupId}`);
  setAlert('InvitationAccepted');
}

function handleDecline(setOpen, navigate) {
  setOpen(false);
  navigate(`/`);
}

/**
 *
 * @param {Boolean} open A state representing a boolean value of whether the modal should be open.
 * @param {Object} settings An object containing group settigns data.
 * @param {Function} setOpen A state setter to change the modal open state.
 * @param {Function} navigate A react function to navigate users to specified paths.
 * @param {Function} setAlert A state setter to trigger an alert to the user.
 * @param {Object} user An object containing userId and first name.
 */
export default function InviteModal({ open, settings, setOpen, navigate, setAlert, user }) {

  return (
    <Modal
      open={open}
      aria-labelledby="invite-modal"
      aria-describedby="invite-modal"
      >
      <ModalBox>
        <span>
          <Typography id="invite-modal" variant="h6" sx={{ pb: 2, textAlign: 'center' }}>
            You have been invited to join <strong>{settings.groupName}</strong>
          </Typography>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <Button variant="contained" color="success" onClick={() => handleAccept(settings, setOpen, navigate, setAlert, user)}>
              Accept
            </Button>
            <Button variant="contained" onClick={() => handleDecline(setOpen, navigate)}>
              Decline
            </Button>
          </span>
        </span>
      </ModalBox>
    </Modal>
  )
}
