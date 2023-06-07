import { Grid, Typography } from '@mui/material';
import BaseGraph from './BaseGraph';

export default function ExerciseInfo() {
  const data = [
    { date: '01/01/2023', type: 'Running', totalMinutes: 45 },
    { date: '01/02/2023', type: 'Yoga', totalMinutes: 60 },
    { date: '01/03/2023', type: 'Lift Weights', totalMinutes: 30 },
    { date: '01/04/2023', type: 'Hiking', totalMinutes: 90 },
    { date: '01/05/2023', type: 'H.I.I.T.', totalMinutes: 45 },
  ];

  return (
    <Grid container my={2} justifyContent="space-between" >
      <Grid item xs={12} sm={8} md={6} sx={{paddingX: 4, minHeight: '35vh' }} >
        <BaseGraph exercises={data} />
      </Grid>
      <Grid
        item
        container
        xs={12} sm={4} md={6}
        sx={{ padding: 4,
          justifyContent: 'space-evenly',
          flexDirection: 'column',
          display: 'flex' }}
      >
        <Grid mr={16}>
          <Typography variant="h6" align="left">
            <strong>
              Log your exercises to begin generating data.
            </strong>
          </Typography>
        </Grid>
        <Grid mt={3} ml={16}>
          <Typography variant="h6" align="right">
            <strong>
              View your weekly progress & see your improvements.
            </strong>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
