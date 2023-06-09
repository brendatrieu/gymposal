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
    quaternary: {
      main: '#D995EE'
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
            color: "#214C67"
          },
          "&.Mui-active": {
            "&&": {
              color: "#214C67",
              fontWeight: 700,
              "& * ": {
                color: "#214C67"
              }
            }
          }
        },
        icon: {
          color: "#214C67"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
        color: "#214C67"
        }
      }
    },

  }

});

export default theme;
