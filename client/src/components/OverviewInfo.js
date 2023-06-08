import { Link } from 'react-router-dom';
import './OverviewInfo.css';
import { Button, styled, Box } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { FlexTypographyMedium } from './FlexTypography';

const FlexButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    transform: 'scale(1.5)'
  },
}));

export const FlexBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1)
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}))

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
        <FlexBox className="overview-icons">
          <TimelineIcon />
          <FlexTypographyMedium>
            Log Exercises
          </FlexTypographyMedium>
        </FlexBox>
        <FlexBox className="overview-icons">
          <GroupAddIcon />
          <FlexTypographyMedium>
            Create Groups
          </FlexTypographyMedium>
        </FlexBox>
        <FlexBox className="overview-icons">
          <AssignmentIcon />
          <FlexTypographyMedium>
            Set Group Rules
          </FlexTypographyMedium>
        </FlexBox>
        <FlexBox className="overview-icons">
          <ScoreboardIcon />
          <FlexTypographyMedium>
            Track Bets
          </FlexTypographyMedium>
        </FlexBox>
      </div>
    </>
  )
}
