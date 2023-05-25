import { styled } from '@mui/material/styles';
import { Alert, IconButton, Snackbar, Slide, SlideProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAlert } from '../context/AppContext';

const PaddedAlert = styled(Alert)(({ theme }) => ({
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '75vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '50vw',
  },
}));

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="down" />;
}

export default function AlertBanner() {
  const { alert, setAlert } = useAlert();

  if (!alert) return null;

  function handleClose(Transition){
    setAlert(false);
  }

  return (
      <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!alert}
          autoHideDuration={3000}
          direction="down"
          TransitionComponent={SlideTransition}
          onClose={handleClose}
        >
        <PaddedAlert
          severity={alert.severity}
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
          {alert.message}
        </PaddedAlert>
    </Snackbar>
  )
}
