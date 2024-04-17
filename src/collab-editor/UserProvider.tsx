import { createContext, useContext, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { getRandomUserName } from "./util/getRandomUserName";

export interface User {
  id: string;
  name: string;
}

export const UserContext = createContext<User>({
  id: "unknown",
  name: "Unknown User",
});

export const useCurrentUser = (): User => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUser: User = useMemo(() => {
    const id = uuid();
    return {
      id,
      name: getRandomUserName(id),
    };
  }, []);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};
