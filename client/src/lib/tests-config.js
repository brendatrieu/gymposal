import AppProvider from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';

export default function AllWrappers({ children }) {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </BrowserRouter>
  )
}
