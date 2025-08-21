import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  if (!user) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the page
  return children;
};

export default ProtectedRoute;
