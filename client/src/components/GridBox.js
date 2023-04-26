import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const GridBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0),
  },
}));
