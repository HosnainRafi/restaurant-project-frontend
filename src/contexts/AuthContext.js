import { createContext } from "react";

export const AuthContext = createContext({
  user: null, // Firebase user object
  dbUser: null, // User profile from our own database
  isLoading: true,
  refetchDbUser: () => {},
});
