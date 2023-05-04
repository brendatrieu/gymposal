import {
  createContext,
  useContext,
  useState,
  useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AppContext = createContext();
export { AppContext };

export function useAlert() {
  const { alert, setAlert } = useContext(AppContext);
  return { alert, setAlert };
}

export function useUser() {
  const { user, setUser, tokenKey } = useContext(AppContext);
  return { user, setUser, tokenKey };
}

export default function Provider({children}){
  const [ alert, setAlert ] = useState(false);
  const [ user, setUser ] = useState();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const tokenKey = 'react-context-jwt';

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, [])

  if (isAuthorizing) return null;

  return (
    <AppContext.Provider value={{ user, setUser, alert, setAlert, tokenKey }}>
      {children}
    </AppContext.Provider>
  )
}
