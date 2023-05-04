import { createContext, useContext, useState } from 'react';

const AppContext = createContext();
export { AppContext };

export function useAlert() {
  const { alert, setAlert } = useContext(AppContext);
  return { alert, setAlert };
}

export function useUser() {
  const { user, setUser } = useContext(AppContext);
  return { user, setUser };
}

export default function Provider({children}){
  const [ alert, setAlert ] = useState(false);
  const [ user, setUser ] = useState();

  return (
    <AppContext.Provider value={{ user, setUser, alert, setAlert }}>
      {children}
    </AppContext.Provider>
  )
}
