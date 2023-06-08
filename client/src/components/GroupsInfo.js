import { Grid } from '@mui/material';
import GroupsInfoTimeline from '../components/GroupsInfoTimeline';

export default function ExerciseInfo() {

  return (
    <Grid container my={3} justifyContent="space-between" >
      <Grid
        item
        xs={12}
        sx={{
          justifyContent: 'space-evenly',
          flexDirection: 'column',
          display: 'flex'
        }}
      >
        <img
          src='groups.png'
          alt='Group of friends working out together.'
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={12} py={3} >
        <GroupsInfoTimeline />
      </Grid>
    </Grid>
  )
}
