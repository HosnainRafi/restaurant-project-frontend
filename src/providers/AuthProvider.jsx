import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import api from "../lib/api"; // Make sure your api utility is configured

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [dbUser, setDbUser] = useState(null); // Your database user profile
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // User is signed in with Firebase
        setUser(firebaseUser);

        try {
          // Fetch the user's profile from your backend
          const response = await api.get("/auth/me");
          setDbUser(response.data.data);
        } catch (error) {
          console.error("Failed to fetch user profile from DB:", error);
          setDbUser(null); // Clear profile on error
        }
      } else {
        // User is signed out
        setUser(null);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
