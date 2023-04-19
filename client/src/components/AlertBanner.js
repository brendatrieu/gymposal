import { styled } from '@mui/material/styles';
import { Alert, IconButton, Snackbar, Slide, SlideProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useContext} from 'react';
import AppContext from '../context/AppContext';

const PaddedAlert = styled(Alert)(({ theme }) => ({
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '75vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '50vw',
  },
}));

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

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
        alertType.msg = 'An unexpected error occurred. Please try again.';
        break;
      default:
        return false;
    }
  }

  alertSeverity();

  function handleClose(Transition){
    setAlert(false);
  }


  return (
    <>
      { alert &&
        (<Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={Boolean(alert)}
          autoHideDuration={3000}
          direction="down"
          TransitionComponent={SlideTransition}
          onClose={handleClose}>
          <PaddedAlert
            severity={alertType.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertType.msg}
          </PaddedAlert>
        </Snackbar>
        )
        }
    </>
  )
}
