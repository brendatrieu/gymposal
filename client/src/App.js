import { ThemeProvider } from '@mui/material';
import Theme from './lib/Theme';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import Launchpad from './pages/Launchpad';
import LogExercise from './pages/LogExercise';
import Provider from './context/AppContext';
import { Routes, Route } from 'react-router-dom';

export default function App() {

  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Header />} >
            <Route index element={<Launchpad />} />
            <Route path="logExercise" element={<LogExercise />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}
