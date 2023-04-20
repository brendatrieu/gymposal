import { createContext, useContext } from 'react';

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
