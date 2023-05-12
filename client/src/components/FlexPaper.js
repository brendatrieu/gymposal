import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const FlexPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  height: '100%',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));
