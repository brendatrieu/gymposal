import { ThemeProvider } from '@mui/material';
import Theme from './lib/Theme';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import Launchpad from './pages/Launchpad';
import LogExercise from './pages/LogExercise';
import AppContext from './context/AppContext';





export default function App() {


  return (
    <AppContext.Provider value={{ user: 1 }}>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Header />
        {/* <Launchpad /> */}
        <LogExercise />
      </ThemeProvider>
    </AppContext.Provider>
  );
}
