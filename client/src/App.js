import { ThemeProvider } from '@mui/material';
import theme from './lib/Theme';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Launchpad from './pages/Launchpad';
import LogExercise from './pages/LogExercise';
import GroupForm from './pages/GroupForm';
import GroupHome from './pages/GroupHome';
import AppProvider from './context/AppContext';
import { Routes, Route } from 'react-router-dom';

export default function App() {

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Header />} >
            <Route index element={<Launchpad />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="log-exercise" element={<LogExercise />} />
            <Route path="group-form" element={<GroupForm />} >
              <Route path=":groupId" element={<GroupForm />} />
            </Route>
            <Route path="group-home/:groupId/:inviteLink?" element={<GroupHome />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </AppProvider>
  );
}
