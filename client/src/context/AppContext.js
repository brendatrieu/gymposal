import { createContext, useContext, useState } from 'react';

const AppContext = createContext();
export { AppContext };

export function useAlert() {
  const { alert, setAlert } = useContext(AppContext);
  return { alert, setAlert };
}

export function useUser() {
  const { userId, firstName } = useContext(AppContext);
  return { userId, firstName };
}

export default function Provider({children}){
  const [ alert, setAlert ] = useState(false);

  return (
    <AppContext.Provider value={{ userId: 2, firstName: 'Brenda', alert, setAlert }}>
      {children}
    </AppContext.Provider>
  )
}
