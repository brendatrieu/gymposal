import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#ffffff'
    },
    secondary: {
      main: '#151a26'
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    button: {
      textTransform: 'unset'
    }
  },
});

export default theme;
