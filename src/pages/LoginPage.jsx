import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in:", error);
      if (error.code === "auth/invalid-credential") {
        toast.error("Incorrect email or password. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 mb-12 flex items-center justify-center px-4 bg-gradient-to-br from-[#F9F9F6] to-[#FFF7F2] min-h-[calc(100vh - 395px)]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>

        <h2 className="text-3xl font-bold text-primary text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-text-secondary text-sm mb-8">
          Login to access your admin dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition shadow-sm"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition shadow-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-1 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-md font-semibold text-sm shadow-lg transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-primary/90 hover:to-secondary/90"
            }`}
          >
            {loading && <ImSpinner3 className="animate-spin text-white" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-3">
            <a
              href="#"
              className="text-sm text-primary hover:underline transition"
            >
              Forgot Password?
            </a>
          </div>

          {/* Register redirect using Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
