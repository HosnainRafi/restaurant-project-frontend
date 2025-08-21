import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // 👈 Update this import path

export const useAuth = () => {
  return useContext(AuthContext);
};
