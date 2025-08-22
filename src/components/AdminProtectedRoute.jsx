import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useRole from '@/hooks/useRole';

const AdminProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const role = useRole();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
