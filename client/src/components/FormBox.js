import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const FormBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(12),
    paddingRight: theme.spacing(12),
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(14),
    paddingRight: theme.spacing(14),
  },
}));

export default FormBox;
