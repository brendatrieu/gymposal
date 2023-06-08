import { Typography, styled } from '@mui/material';

export const FlexTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    fontSize: '1.75rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
}));
