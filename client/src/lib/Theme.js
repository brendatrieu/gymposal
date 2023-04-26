import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff'
    },
    secondary: {
      main: '#151a26'
    },
    tertiary: {
      main: "#214C67"
    },
    mode: 'dark'
  },
  typography: {
    fontFamily: 'Open Sans',
    button: {
      textTransform: 'unset'
    },
  },
  components: {
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "secondary.main",
          "&:hover": {
            color: "tertiary.main"
          },
          "&.Mui-active": {
            "&&": {
              color: "tertiary.main",
              fontWeight: 700,
              "& * ": {
                color: "tertiary.main"
              }
            }
          }
        },
        icon: {
          color: "tertiary.main"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
        color: "tertiary.main"
        }
      }
    },
  }
});

export default theme;
