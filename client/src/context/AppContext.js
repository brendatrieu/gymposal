import { createContext, useContext, useState } from 'react';

const AppContext = createContext();
export { AppContext };

export function useAlert() {
  const { alert, setAlert } = useContext(AppContext);
  return { alert, setAlert };
}

export function useUser() {
  const { userId } = useContext(AppContext);
  return { userId };
}

export default function Provider({children}){
  const [ alert, setAlert ] = useState(false);

  return (
    <AppContext.Provider value={{ userId: 2, alert, setAlert }}>
      {children}
    </AppContext.Provider>
  )
}
