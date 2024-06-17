import axios from "axios";
import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  color: string;
  displayPrefrence: string;
  email: string;
}
interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<User | object>({});

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:3000/users/me", { withCredentials: true })
        .then(({ data }) => {
          setUser(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
