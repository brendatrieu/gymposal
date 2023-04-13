// import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import Launchpad from './components/Launchpad';

function App() {
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
        // fontSize: '0.05rem',
        textTransform: 'unset'
      }
    },
  })
  // const [serverData, setServerData] = useState("");

  // useEffect(() => {
  //   async function getServerData() {
  //     const resp = await fetch('/api/hello');
  //     const data = await resp.json();

  //     console.log('Data from server:', data);

  //     setServerData(data.message);
  //   }

  //   getServerData();
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Launchpad />
    </ThemeProvider>
    // <CssVarsProvider>
    //   <CssBaseline />
      /* <ResponsiveAppBar /> */
    // </CssVarsProvider>
  );
}

export default App;
