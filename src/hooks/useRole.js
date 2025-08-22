import { useAuth } from '@/hooks/useAuth';

const useRole = () => {
  const { dbUser } = useAuth();
  return dbUser?.role || null;
};

export default useRole;
