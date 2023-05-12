import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PaidIcon from '@mui/icons-material/Paid';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector";

const FlexTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.85rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

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
    1: <GroupAddIcon />,
    2: <PaidIcon />,
    3: <MilitaryTechIcon />
  };

  return (
    <ColorlibStepIconRoot>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const launchpadSteps = [
  "Create or join a group with your friends",
  "Bet against your friends on how much you'll work out each week",
  "Win challenges if your friends don't meet the group requirements"
];

const groupSteps = [
  "Bet against your friends on how much you'll work out each week",
  "Pay your friends if you don't meet the group requirements",
  "Or...get paid if your friends lose the bet!"
];

export default function CustomizedSteppers({page}) {
  const steps = page === 'launchpad' ? launchpadSteps : groupSteps;

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step active key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}><FlexTypography sx={{color: 'black'}}>{label}</FlexTypography></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
