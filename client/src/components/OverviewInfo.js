import { Link } from 'react-router-dom';
import './OverviewInfo.css';
import { Button, styled } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const FlexButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    transform: 'scale(1.5)'
  },
}));

export default function OverviewInfo() {
  return (
    <>
      <div className="position-relative">
        <img
          src='overview-cover.png'
          alt='Keep track of workouts. Challenge your friends. Get fit together. Gymposal.'
          style={{ width: '100%' }}
        />
        <Link
          to="/sign-up"
          className="position-absolute"
          style={{ textDecoration: 'none', color: 'white', bottom: '10%', right: '5%' }}>
          <FlexButton
            color="quaternary"
            variant="contained"
            size="medium"
          >
            Sign up for free.
          </FlexButton>
        </Link>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} >
        <div className="overview-icons">
          <TimelineIcon />
          Log Exercises
        </div>
        <div className="overview-icons">
          <GroupAddIcon />
          Create Groups
        </div>
        <div className="overview-icons">
          <AssignmentIcon />
          Set Group Rules
        </div>
        <div className="overview-icons">
          <ScoreboardIcon />
          Track Bets
        </div>
      </div>
    </>
  )
}
