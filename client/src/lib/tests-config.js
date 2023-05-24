import Provider from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';

export default function AllWrappers({ children }) {
  return (
    <BrowserRouter>
      <Provider>
        {children}
      </Provider>
    </BrowserRouter>
  )
}
