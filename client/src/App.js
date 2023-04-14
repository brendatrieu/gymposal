// import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import Launchpad from './components/Launchpad';

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
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Launchpad />
    </ThemeProvider>
  );
}

export default App;
