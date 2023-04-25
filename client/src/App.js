import { ThemeProvider } from '@mui/material';
import theme from './lib/Theme';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import Launchpad from './pages/Launchpad';
import LogExercise from './pages/LogExercise';
import CreateGroup from './pages/CreateGroup';
import Provider from './context/AppContext';
import { Routes, Route } from 'react-router-dom';

export default function App() {

  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Header />} >
            <Route index element={<Launchpad />} />
            <Route path="log-exercise" element={<LogExercise />} />
            <Route path="create-group" element={<CreateGroup />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}
