import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TimerIcon from '@mui/icons-material/Timer';
import PaidIcon from '@mui/icons-material/Paid';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector";
import { FlexTypographyMedium } from './FlexTypography';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(180deg, rgb(26,109,255) 0%, rgb(193,38,255) 100%)"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1
  }
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: "linear-gradient(180deg, rgb(26,109,255) 0%, rgb(193,38,255) 100%)",
  boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
}));

function ColorlibStepIcon(props) {
  const icons = {
    1: <TimesOneMobiledataIcon />,
    2: <TimerIcon />,
    3: <PaidIcon />
  };

  return (
    <ColorlibStepIconRoot>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}


export default function GroupsInfoTimeline({page}) {
  const steps = [
    'Set the number of times each member has to work out every week.',
    'Determine the how long each work out needs to be to qualify.',
    'Up for a little healthy competition? Place some bets!',
  ]

  return (
    <Stack sx={{ width: '100%' }} >
      <Stepper
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step active key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}><FlexTypographyMedium mx={2}>{label}</FlexTypographyMedium></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
