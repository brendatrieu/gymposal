import { Grid, Typography } from '@mui/material';

export default function ExerciseInfo() {
  const data = [
    { date: '01/01/2023', type: 'Running', totalMinutes: 45 },
    { date: '01/03/2023', type: 'Yoga', totalMinutes: 60 },
    { date: '01/04/2023', type: 'Lift Weights', totalMinutes: 30 },
    { date: '01/02/2023', type: 'Hiking', totalMinutes: 90 },
    { date: '01/05/2023', type: 'H.I.I.T.', totalMinutes: 45 },
  ];

  return (
    <Grid container justifyContent="space-evenly" >
      <Grid item xs={12} sm={8} md={5}>
        <img
          style={{width: '100%' }}
          src='./graph_example.png'
          alt="A graph showing total minutes of exercise per day."
        />
      </Grid>
      <Grid
        item
        container
        xs={12} sm={4} md={5}
        sx={{ padding: 4,
          justifyContent: 'space-evenly',
          flexDirection: 'column',
          display: 'flex' }}
      >
        <Grid mr={8}>
          <Typography variant="h6" align="left">
            <strong>
              Log your exercises to begin generating data.
            </strong>
          </Typography>
        </Grid>
        <Grid mt={3} ml={8}>
          <Typography variant="h6" align="right">
            <strong>
              View your weekly progress and see your improvements.
            </strong>
          </Typography>
        </Grid>
      </Grid>
    </Grid>

  )
}
