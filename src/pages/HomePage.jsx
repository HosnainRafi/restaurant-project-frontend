import { useAuth } from "@/hooks/useAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Restaurant Home Page</h1>
      {user ? (
        <div className="text-center">
          <p>Welcome, {user.email}!</p>
          <button
            onClick={() => signOut(auth)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>
          You are not logged in.{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login here
          </Link>
        </p>
      )}
    </div>
  );
};

export default HomePage;
