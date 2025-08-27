import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import api from "../lib/api"; // Make sure your api utility is configured

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [dbUser, setDbUser] = useState(null); // Your database user profile
  const [isLoading, setIsLoading] = useState(true);

  const fetchDbUser = async () => {
    // Prevent fetching if there's no logged-in user
    if (!auth.currentUser) {
      setDbUser(null);
      return;
    }

    try {
      // The api interceptor automatically adds the token
      const response = await api.get("/auth/me");
      console.log("rafi is", response);
      setDbUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user profile from DB:", error);
      setDbUser(null); // Clear profile on error
    }
  };

  // This is the function that will be exposed to other components
  const refetchDbUser = () => {
    fetchDbUser();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchDbUser();
      } else {
        setDbUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user, // Firebase auth object
    dbUser, // Your database user profile (contains role)
    isLoading,
    refetchDbUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
