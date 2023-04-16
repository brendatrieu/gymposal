import { styled } from '@mui/material/styles';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import AppContext from '../context/AppContext';

const PaddedAlert = styled(Alert)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
}));



export default function AlertBanner() {
  const { alert, setAlert } = useContext(AppContext);
  const alertType = {};

  function alertSeverity() {
    switch (alert){
      case 'ExerciseSaved':
        alertType.severity = 'success';
        alertType.msg = 'Exercise successfully saved.';
        break;
      case 'ErrorOccurred':
        alertType.severity = 'error';
        alertType.msg = 'An unexpected error occurred.';
        break;
      default:
        return false;
    }
  }

  alertSeverity();

  return (
    <>
      { alert &&
        (<PaddedAlert
          variant="outlined"
          severity={alertType.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertType.msg}
        </PaddedAlert>)
        }
    </>
  )
}
