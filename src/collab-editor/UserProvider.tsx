import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
}

export const UserProvider = createContext<User>({
  id: "unknown",
  name: "Unknown User",
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrentUser = (): User => {
  return useContext(UserProvider);
};
