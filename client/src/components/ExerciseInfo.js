import { Grid, Typography, styled } from '@mui/material';
import BaseGraph from './BaseGraph';

export default function ExerciseInfo() {
  const data = [
    { date: '01/01/2023', type: 'Running', totalMinutes: 45 },
    { date: '01/02/2023', type: 'Yoga', totalMinutes: 60 },
    { date: '01/03/2023', type: 'Lift Weights', totalMinutes: 30 },
    { date: '01/04/2023', type: 'Hiking', totalMinutes: 90 },
    { date: '01/05/2023', type: 'H.I.I.T.', totalMinutes: 45 },
  ];

  const FlexTypography = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      fontSize: '1.75rem',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
    },
  }));

  return (
    <Grid container my={2} justifyContent="space-between" >
      <Grid item xs={12} sm={8} md={6} sx={{padding: 3, minHeight: '40vh' }} >
        <BaseGraph exercises={data} />
      </Grid>
      <Grid
        item
        container
        xs={12} sm={4} md={6}
        sx={{ padding: 3,
          justifyContent: 'space-evenly',
          flexDirection: 'column',
          display: 'flex' }}
      >
        <Grid mr={16}>
          <FlexTypography variant="h6" align="left">
            <strong>
              Log your exercises to begin generating data.
            </strong>
          </FlexTypography>
        </Grid>
        <Grid mt={3} ml={16}>
          <FlexTypography align="right">
            <strong>
              View your weekly progress and see your improvements.
            </strong>
          </FlexTypography>
        </Grid>
      </Grid>
    </Grid>
  )
}
